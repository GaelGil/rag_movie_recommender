from app.chat.utils.composio_tools import composio_tools as tools
from app.chat.utils.prompts import CHATBOT_PROMPT
from app.chat.models import ChatSession, ChatMessage, ToolHistory
from app.chat.utils.formaters import (
    parse_composio_news_search_results,
    parse_composio_search_results,
    parse_vector_search_results,
)
from app.extensions import db
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from composio import Composio
import os
import json
import logging
import traceback
from sqlalchemy import text

# logging stuff
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
# load env
load_dotenv(Path("../../.env"))


def get_embedding(text: str) -> list[float]:
    """Get the embedding of a text

    args:
        text (str): The text to get the embedding of

    returns:
        list[float]: The embedding of the text

    """
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    response = client.embeddings.create(model="text-embedding-3-small", input=text)
    return response.data[0].embedding


def recommend(query: str, top_k: int = 3):
    """
    Recommend documents based on user's preference or query.

    Args:
        query (str): The user's preference or query.
        top_k (int): The number of documents to recommend.

    Returns:
        list: A list of recommended documents.
    """
    # Generate embedding for user's preference or query
    logger.info(f"[DEBUG] GETTING EMBEDDING FOR QUERY: {query}")
    query_vector = get_embedding(query)
    logger.info("[DEBUG] SEARCHING MOVIES")
    sql = text("""
        SELECT id, title
        FROM movies
        ORDER BY embedding <-> CAST(:query_vector AS vector)
        LIMIT :top_k
    """)

    result = db.session.execute(sql, {"query_vector": query_vector, "top_k": top_k})
    logger.info(f"[DEBUG] RESULT: {result}")
    return [{"movie": r.title} for r in result]


class ChatService:
    def __init__(self, user_id: str, session_id: str = None):
        # self.app = app
        self.user_id = user_id
        self.composio_user_id = "0000-1111-2222"
        self.session_id = session_id
        self.chat_session = None
        self.model_name = "gpt-4.1-mini"
        self.tools = tools
        self.composio = Composio()
        self.llm: OpenAI = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

        # with self.app.app_context():
        # Load existing chat session if session_id is provided
        if self.session_id:
            self.chat_session = ChatSession.query.get(self.session_id)
        # If no session exists, create a new one
        if not self.chat_session:
            self.chat_session = ChatSession(user_id=self.user_id)
            db.session.add(self.chat_session)
            db.session.commit()
            self.session_id = self.chat_session.id

        # Initialize chat_history from DB
        self.chat_history = self.get_chat_history()
        # Initialize tool_history from DB
        self.tool_history = self.get_tool_history()

        # Add initial developer prompt if history is empty
        if not self.chat_history:
            self.add_chat_history(role="developer", message=CHATBOT_PROMPT)
            self.chat_history = self.get_chat_history()

    def add_chat_history(self, role: str, message: str):
        chat_message = ChatMessage(
            session_id=self.chat_session.id, role=role, content=message
        )
        # with self.app.app_context():
        db.session.add(chat_message)
        db.session.commit()
        self.chat_history = self.get_chat_history()

    def add_tool_history(self, tool_name: str, tool_args: str, tool_output: str):
        tool_history = ToolHistory(
            session_id=self.chat_session.id,
            tool_name=tool_name,
            tool_args=tool_args,
            tool_output=tool_output,
        )
        db.session.add(tool_history)
        db.session.commit()
        self.tool_history = self.get_tool_history()

    def get_tool_history(self):
        return [
            {"tool_name": tool.tool_name, "tool_args": tool.tool_args}
            for tool in ToolHistory.query.filter_by(
                session_id=self.chat_session.id
            ).order_by(ToolHistory.id)
        ]

    def get_chat_history(self):
        return [
            {"role": msg.role, "content": msg.content}
            for msg in ChatMessage.query.filter_by(
                session_id=self.chat_session.id
            ).order_by(ChatMessage.id)
        ]

    def process_message(self, message):
        """Processes a message

        Args:
            message (str): The message to process

        Returns:
            None

        """
        logger.info(f"chat_session_id: {self.chat_session}")
        logger.info(f"[DEBUG] chat_history: {self.chat_history}")
        # add user message to chat history
        self.add_chat_history(role="user", message=message)
        # log the message
        logger.info(f"process_message called with message: {message}")
        # stream the response
        stream = self.llm.responses.create(
            model=self.model_name,
            input=self.chat_history,
            tools=self.tools,
            tool_choice="auto",
            stream=True,
        )

        # keep track of tool calls
        tool_calls = {}
        init_response = ""
        # initial call
        for event in stream:
            logger.info(
                f"\n[DEBUG EVENT] type={event.type}, idx={getattr(event, 'output_index', None)}, delta={getattr(event, 'delta', None)}"
            )

            # if there is text, print it
            if event.type == "response.output_text.delta":
                # yield the text
                yield json.dumps({"type": "init_response", "text": event.delta})
                logger.info(f"response.output_text.delta: {event.delta}")
                init_response += event.delta
            # if there is no text, print a newline
            elif event.type == "response.output_text.done":
                print()

            # else if there is a tool call
            # name of the tool is in response.output.item
            elif (
                event.type == "response.output_item.added"
                and event.item.type == "function_call"
            ):
                # output_index is the index of the tool call
                # because they come in chunks we need to keep track of the index
                idx = getattr(event, "output_index", 0)
                if idx not in tool_calls:
                    # if the index is not in the tool calls dict, add it
                    tool_calls[idx] = {
                        "name": None,
                        "arguments_fragments": [],
                        "arguments": None,
                        "done": False,
                    }
                    logger.info(f"[DEBUG] Added tool call slot idx={idx}")
                tool_calls[idx]["name"] = event.item.name  # get the name of the tool

            # else if there is a tool argument (they come in chunks as strings)
            elif event.type == "response.function_call_arguments.delta":
                # output_index is the index of the tool call
                idx = getattr(event, "output_index", 0)
                if idx not in tool_calls:  # if not in the tool calls dict, add it
                    tool_calls[idx] = {
                        "name": None,
                        "arguments_fragments": [],
                        "arguments": None,
                        "done": False,
                    }
                # delta (arguments) may be a string fragment so we add it
                args_frag = (
                    event.delta
                    if isinstance(event.delta, str)
                    else json.dumps(event.delta)
                )
                # add up the argument strings for the tool call
                tool_calls[idx]["arguments_fragments"].append(args_frag)
                logger.info(f"[DEBUG] Arg fragment for idx={idx}: {args_frag}")

            # else if the tool call is done
            elif event.type == "response.function_call_arguments.done":
                # output_index is the index of the tool call
                idx = getattr(event, "output_index", 0)
                # if the index is not in the tool calls dict, add it
                if idx not in tool_calls:
                    tool_calls[idx] = {
                        "name": None,
                        "arguments_fragments": [],
                        "arguments": None,
                        "done": False,
                    }
                # mark the tool call as done
                tool_calls[idx]["done"] = True
                # join the argument fragments into a single string
                tool_calls[idx]["arguments"] = "".join(
                    tool_calls[idx]["arguments_fragments"]
                ).strip()
                # log statment for tool done
                logger.info(f"[DEBUG] Marked tool idx={idx} done")

        logger.info(f"TOOL CALLS: {tool_calls}")

        self.add_chat_history(role="assistant", message=init_response)
        # Execute the tool calls
        for tool_idx, tool in tool_calls.items():
            tool_name = tool["name"]
            args_str = tool["arguments"]

            if not tool_name:  # if tool name is None
                logger.info(f"[DEBUG] No tool name for idx={tool_idx}, skipping")
                continue  # continue

            # try to parse the arguments
            try:
                parsed_args = json.loads(args_str)
            except json.JSONDecodeError:
                parsed_args = {}
                logger.info(
                    f"[DEBUG] Failed to parse args for idx={tool_idx}, using empty dict"
                )
            # yield the tool call
            yield json.dumps(
                {"type": "tool_use", "tool_name": tool_name, "tool_input": parsed_args}
            )
            try:
                result = self.execute_tool(tool_name, parsed_args)
            except TypeError:
                result = self.execute_tool(tool_name, parsed_args.get("location"))

            logger.info(f"[DEBUG] Tool result for idx={tool_idx}: {result}")
            parsed_result = self.parse_result(tool_name, result)
            logger.info(f"[DEBUG] Tool result for idx={tool_idx}: {parsed_result}")

            # yield the tool result
            yield json.dumps(
                {
                    "type": "tool_result",
                    "tool_name": tool_name,
                    "tool_input": parsed_args,
                    "tool_result": parsed_result,
                }
            )
            logger.info(f"[DEBUG] Tool result for idx={tool_idx}: {parsed_result}")

            # Add the tool call result to the chat history
            self.add_chat_history(
                role="assistant",
                message=f"TOOL_NAME: {tool_name}, RESULT: {parsed_result}",
            )

        logger.info(f"[DEBUG] chat_history: {self.chat_history}")

        # Get the final answer
        # IF we called tools to get updated information then we must form a final response
        if tool_calls:
            logger.info("[DEBUG] Calling model for final answer...")
            # Call the model again with the tool call results
            final_stream = self.llm.responses.create(
                model=self.model_name,
                input=self.chat_history,
                stream=True,
            )

            final_response = ""
            # Stream partial text
            for ev in final_stream:
                logger.info(
                    f"\n[DEBUG EVENT FINAL] type={ev.type}, delta={getattr(ev, 'delta', None)}"
                )
                # if there is text, print it/yield it
                if ev.type == "response.output_text.delta":
                    yield json.dumps({"type": "final_response", "text": ev.delta})
                    logger.info(ev.delta)
                    final_response += ev.delta
                # if there is no text, print a newline
                elif ev.type == "response.output_text.done":
                    print()
            self.add_chat_history(role="assistant", message=final_response)

    def parse_result(self, tool_name: str, result: dict):
        """Parse the result of a tool call

        Args:
            result (dict): The result of a tool call

        Returns:
            dict: The parsed result
        """
        if "news" in tool_name.lower():
            parsed_result = parse_composio_news_search_results(result)
            logger.info("Used news search parser")
        elif "movies" in tool_name.lower():
            parsed_result = parse_vector_search_results(result)
            logger.info("Used vector search parser")
        else:
            parsed_result = parse_composio_search_results(result)
            logger.info("Used general search parser")
        return parsed_result

    def execute_tool(self, tool_name: str, tool_args: dict):
        """Execute a tool

        Args:
            tool_name (str): The name of the tool to execute
            tool_args (dict): The arguments to pass to the tool

        Returns:
            Any: The result of the tool

        """
        logger.info(f"Executing tool: {tool_name} with args: {tool_args}")
        logger.info(
            f"Tool Name Type {type(tool_name)}, Tool Args Type {type(tool_args)}"
        )
        try:
            if tool_name == "recommend_movies":
                return recommend(tool_args["query"], tool_args["top_k"])
            result = self.composio.tools.execute(
                slug=tool_name,
                user_id=self.composio_user_id,
                arguments=tool_args,
            )
            logger.info(f"Raw Composio result: {result}")
            logger.info(f"Composio result type: {type(result)}")
            return result
        except Exception as e:
            error_msg = f"Tool execution failed: {str(e)}"
            logger.info("!!! TOOL EXECUTION EXCEPTION !!!")
            logger.info(f"Error type: {type(e).__name__}")
            logger.info(f"Error message: {str(e)}")
            logger.info(f"Traceback: {traceback.format_exc()}")

            return {"error": error_msg}
