import { useState } from "react";
import { Box, Textarea, Loader, Button } from "@mantine/core";
import type { ChatInputProps } from "../../types/Chat";
import { FiArrowUp } from "react-icons/fi";

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Box pos="fixed" bottom={"5%"} left={"25%"} w="50%" mx="auto">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Ask me about movies ... (Press Enter to send, Shift+Enter for new line)"
        disabled={disabled}
        rows={Math.min(Math.max(1, message.split("\n").length), 5)}
        radius="xl"
        autosize
        minRows={3}
        w="100%"
        size="xl"
      />
      {message ? (
        <Box pos="absolute" right={0}>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled}
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {disabled ? <Loader /> : <FiArrowUp />}
          </Button>
        </Box>
      ) : (
        <></>
      )}
    </Box>
  );
};

export default ChatInput;
