// ChatMessage.tsx
import ToolBlock from "./ToolBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container, Text, Box, Flex } from "@mantine/core";
import type { ChatMessageProps } from "../../types/Chat";

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <Container p="md">
        <Flex justify="flex-end">
          <Box miw="70%" c="white" px="md" py="sm" ta={"end"}>
            <Box style={{ maxWidth: "none" }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </Box>
            <Text size="xs" c="dimmed">
              {message.timestamp.toLocaleTimeString()}
            </Text>
          </Box>
        </Flex>
      </Container>
    );
  }

  // assistant
  const blocks = message.response?.blocks ?? [];
  const hasBlocks = blocks.length > 0;

  return (
    <Container bg="red" p="md">
      <div className="max-w-[85%] rounded-lg border border-gray-200 overflow-hidden">
        {hasBlocks ? (
          <div className="space-y-0">
            {blocks.map((block, idx) => {
              if (block.type === "tool_use") {
                return (
                  <ToolBlock
                    key={idx}
                    type="tool_use"
                    toolName={block.tool_name || ""}
                    toolInput={block.tool_input}
                  />
                );
              }

              if (block.type === "tool_result") {
                return (
                  <ToolBlock
                    key={idx}
                    type="tool_result"
                    toolName={block.tool_name || ""}
                    toolInput={block.tool_input}
                    toolResult={block.tool_result}
                  />
                );
              }

              // init_response and final_response are both text blocks
              if (
                block.type === "init_response" ||
                block.type === "final_response"
              ) {
                return (
                  <div key={idx} className="px-4 py-3 border-t border-gray-100">
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {block.content || ""}
                      </ReactMarkdown>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* footer */}
            {!message.isLoading && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                <Text size="xs" c="dimmed">
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </div>
            )}

            {/* spinner while loading */}
            {message.isLoading && (
              <div className="px-4 py-3 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          // fallback: no blocks, show content
          <div className="px-4 py-3">
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </div>

            {message.isLoading ? (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Thinking...</span>
                </div>
              </div>
            ) : (
              <Text size="xs" c="dimmed">
                {message.timestamp.toLocaleTimeString()}
              </Text>
            )}
          </div>
        )}
      </div>
    </Container>
  );
};

export default ChatMessage;
