import { createFileRoute } from "@tanstack/react-router";
import ChatInterface from "../components/Chat/ChatInterface";
export const Route = createFileRoute("/chat")({
  component: ChatInterface,
});