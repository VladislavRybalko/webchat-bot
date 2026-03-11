"use client";

import { useEffect, useRef, useState } from "react";
import MicIcon from "./icons/MicIcon";
import MicOffIcon from "./icons/MicOffIcon";

export default function VoiceInput({ value, onChange, disabled }) {
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Проверяем поддержку
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    // Асинхронно помечаем монтирование
    const timer = setTimeout(() => setMounted(true), 0);

    // Создаём один экземпляр Recognition
    const recognition = new SpeechRecognition();
    recognition.lang = "ru-RU";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      onChange(value + " " + transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      if (recognitionRef.current?.listening) {
        recognitionRef.current.start();
      } else {
        setIsListening(false);
      }
    };

    recognitionRef.current = recognition;
    recognitionRef.current.listening = false;

    return () => clearTimeout(timer);
  }, [onChange, value]);

  if (!mounted || !isSupported)
    return (
      <button
        type="button"
        disabled
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 opacity-50"
      >
        <MicOffIcon className="h-5 w-5" />
      </button>
    );

  const toggleListening = () => {
    if (disabled) return;

    if (isListening) {
      recognitionRef.current.listening = false;
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.listening = true;
      recognitionRef.current.start();
    }
  };

  return (
    <button
      type="button"
      onClick={toggleListening}
      disabled={disabled}
      className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
        isListening
          ? "bg-red-500 text-white mic-recording"
          : "text-accent hover:bg-white/10 hover:text-white"
      }`}
    >
      <MicIcon className="h-5 w-5" />
    </button>
  );
}