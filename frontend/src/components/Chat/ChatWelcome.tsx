import { Container, Title, Text } from "@mantine/core";

function ChatWelcome() {
  return (
    <Container p={"xl"} ta={"center"} m={"xl"}>
      <Title>I am your personal movie recommender</Title>
      <Text>Ask me anything about movies!</Text>
    </Container>
  );
}

export default ChatWelcome;