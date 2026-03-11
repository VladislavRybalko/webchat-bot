import ChatBubbleIcon from "./icons/ChatBubbleIcon";

export default function LoadingIndicator() {
  return (
    <div className="animate-fade-in-up mb-4 flex justify-start px-2">
      <div className="mr-3 flex-shrink-0">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
          <ChatBubbleIcon className="h-4 w-4 text-white" />
        </div>
      </div>
      <div className="rounded-2xl rounded-bl-md bg-assistant-bubble px-5 py-4">
        <div className="flex gap-1.5">
          <div className="typing-dot h-2 w-2 rounded-full bg-blue-300" />
          <div className="typing-dot h-2 w-2 rounded-full bg-blue-300" />
          <div className="typing-dot h-2 w-2 rounded-full bg-blue-300" />
        </div>
      </div>
    </div>
  );
}
