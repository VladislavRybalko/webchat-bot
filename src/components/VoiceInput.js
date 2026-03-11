"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import MicIcon from "./icons/MicIcon";
import MicOffIcon from "./icons/MicOffIcon";
import ProcessingAudio from "./icons/ProcessingAudio";

export default function VoiceInput({ value, onChange, disabled }) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");

  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(!!navigator.mediaDevices?.getUserMedia);
  }, []);

  const startRecording = useCallback(async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/mp4";

      const recorder = new MediaRecorder(stream, { mimeType });
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());

        const blob = new Blob(chunksRef.current, { type: mimeType });
        chunksRef.current = [];

        await transcribe(blob);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);
    } catch (err) {
      if (err.name === "NotAllowedError") {
        setError("Доступ к микрофону запрещён");
      } else {
        setError("Не удалось запустить микрофон");
        console.error(err);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const transcribe = useCallback(
    async (blob) => {
      setIsTranscribing(true);
      try {
        const form = new FormData();
        form.append("audio", blob);

        const res = await fetch("/api/transcribe", {
          method: "POST",
          body: form,
        });

        if (!res.ok) throw new Error("Transcription failed");

        const { text } = await res.json();
        if (text?.trim()) {
          onChange((value + " " + text).trim());
        }
      } catch (err) {
        setError("Ошибка распознавания, попробуйте ещё раз");
        console.error(err);
      } finally {
        setIsTranscribing(false);
      }
    },
    [value, onChange]
  );

  const toggle = useCallback(() => {
    if (disabled) return;
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [disabled, isListening, startRecording, stopRecording]);

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        className="flex h-10 w-10 items-center justify-center rounded-full text-gray-500 opacity-50"
        title="Микрофон не поддерживается"
      >
        <MicOffIcon className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-max max-w-xs rounded-lg bg-red-500/90 px-3 py-1.5 text-xs text-white shadow-lg z-10">
          {error}
        </div>
      )}
      <button
        type="button"
        onClick={toggle}
        disabled={disabled || isTranscribing}
        title={isListening ? "Остановить запись" : "Начать запись"}
        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 ${
          isListening
            ? "bg-red-500 text-white mic-recording"
            : isTranscribing
            ? "bg-yellow-500/80 text-white animate-pulse cursor-wait"
            : "text-accent hover:bg-white/10 hover:text-white"
        }`}
      >
        {isTranscribing ? (
          <ProcessingAudio className="h-5 w-5" />
        ) : (
          <MicIcon className="h-5 w-5" />
        )}
      </button>
    </div>
  );
}