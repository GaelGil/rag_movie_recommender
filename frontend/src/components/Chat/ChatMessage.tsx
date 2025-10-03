// ChatMessage.tsx
import ToolBlock from "./ToolBlock";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Container, Text, Box, Flex, Loader } from "@mantine/core";
import type { ChatMessageProps } from "../../types/Chat";

const ChatMessage = ({ message }: ChatMessageProps) => {
  if (message.role === "user") {
    return (
      <Container p="md">
        <Flex justify="flex-end">
          <Box miw="70%" c="white" px="md" py="sm" ta={"end"}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>
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
    <Container p="md">
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
            if (block.type === "response") {
              return (
                <Flex justify="flex-end">
                  <Box miw="70%" c="white" px="md" py="sm" ta={"end"}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {block.content || ""}
                    </ReactMarkdown>
                  </Box>
                </Flex>
              );
            }

            return null;
          })}

          {/* footer */}
          {!message.isLoading && (
            <Text size="xs" c="dimmed">
              {message.timestamp.toLocaleTimeString()}
            </Text>
          )}

          {/* spinner while loading */}
          {message.isLoading && (
            <div className="px-4 py-3 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <Loader size="xs" />
                <Text>Thinking ...</Text>
              </div>
            </div>
          )}
        </div>
      ) : (
        // fallback: no blocks, show content
        <Flex>
          <Box miw="70%" c="white" px="md" py="sm" ta={"start"}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.content}
            </ReactMarkdown>

            {message.isLoading ? (
              <>
                <Loader size="xs" />
                <span className="text-gray-600">Thinking...</span>
              </>
            ) : (
              <Text size="xs" c="dimmed">
                {message.timestamp.toLocaleTimeString()}
              </Text>
            )}
          </Box>
        </Flex>
      )}
    </Container>
  );
};

export default ChatMessage;
