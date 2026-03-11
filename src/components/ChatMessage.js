"use client";

import ChatBubbleIcon from "./icons/ChatBubbleIcon";
import UserIcon from "./icons/UserIcon";

export default function ChatMessage({ role, content }) {
  const isUser = role === "user";
  const lines = content.split("\n");

  const Icon = isUser ? UserIcon : ChatBubbleIcon;

  return (
    <div
      className={`animate-fade-in-up flex ${
        isUser ? "flex-row-reverse" : "flex-row"
      } mb-4 px-2`}
    >
      <div className="flex-shrink-0 mx-2 content-center">
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full ${
            isUser ? "bg-primary-lighter" : "bg-accent"
          }`}
        >
          <Icon className="h-4 w-4 text-white" />
        </div>
      </div>

      <div
        className={`max-w-[75%] break-words rounded-2xl px-4 py-2 text-sm leading-relaxed sm:text-base ${
          isUser
            ? "bg-user-bubble text-white rounded-br-md"
            : "bg-assistant-bubble text-gray-100 rounded-bl-md"
        }`}
      >
        {lines.map((line, i) => (
          <span key={i}>
            {line}
            {i < lines.length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  );
}
