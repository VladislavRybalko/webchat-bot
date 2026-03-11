"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ChatMessage from "@/components/ChatMessage";
import WelcomeScreen from "@/components/WelcomeScreen";
import LoadingIndicator from "@/components/LoadingIndicator";
import ErrorToast from "@/components/ErrorToast";
import ChatInput from "@/components/ChatInput";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: "user", content: text };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setError(null);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.rows = 1;
    }

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: updatedMessages.slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при получении ответа от сервера");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [input, isLoading, messages]);

  const handleVoiceTranscript = useCallback((transcript) => {
    setInput((prev) => (prev ? prev + " " + transcript : transcript));
    inputRef.current?.focus();
  }, []);

  const hasMessages = messages.length > 0;

  return (
    <div className="flex h-[100dvh] overflow-hidden flex-col bg-gradient-to-b from-primary via-primary-light to-primary">
      <ErrorToast message={error} onDismiss={() => setError(null)} />

      <main className="flex flex-1 flex-col items-center justify-start overflow-hidden px-4 sm:px-6 md:px-8">
        {!hasMessages ? (
          <div className="flex flex-1 w-full items-center justify-center">
            <WelcomeScreen />
          </div>
        ) : (
          <div className="flex w-full max-w-2xl flex-1 flex-col overflow-y-auto py-12 pt-20 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} role={msg.role} content={msg.content} />
            ))}
            {isLoading && <LoadingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      <div className="shrink-0 p-4 w-full flex justify-center pb-8 sticky bottom-0 bg-transparent">
        <div className="w-full max-w-2xl">
          <ChatInput
            ref={inputRef}
            value={input}
            onChange={setInput}
            onSend={sendMessage}
            onVoiceTranscript={handleVoiceTranscript}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
