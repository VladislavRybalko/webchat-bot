import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio"); // Blob

    if (!audio) {
      return NextResponse.json({ error: "No audio" }, { status: 400 });
    }

    // Groq требует имя файла с расширением
    const file = new File([audio], "audio.webm", { type: audio.type });

    const groqForm = new FormData();
    groqForm.append("file", file);
    groqForm.append("model", "whisper-large-v3-turbo"); // быстрая и точная модель
    groqForm.append("language", "ru"); // убери если нужен автодетект
    groqForm.append("response_format", "json");

    const response = await fetch(
      "https://api.groq.com/openai/v1/audio/transcriptions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: groqForm,
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return NextResponse.json({ error: "Transcription failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ text: data.text });
  } catch (err) {
    console.error("Transcribe route error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}