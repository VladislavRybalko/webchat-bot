import { NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Определяет провайдера и создаёт клиент OpenAI-совместимого API.
 * Приоритет: OPENROUTER_API_KEY → OPENAI_API_KEY
 */
function createAIClient() {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey && openrouterKey !== "your_openrouter_api_key_here") {
    return {
      client: new OpenAI({
        apiKey: openrouterKey,
        baseURL: "https://openrouter.ai/api/v1",
      }),
      model:
        process.env.AI_MODEL || "gpt-4o-mini",
      provider: "OpenRouter",
    };
  }

  const openaiKey = process.env.OPENAI_API_KEY;
  if (openaiKey && openaiKey !== "your_openai_api_key_here") {
    return {
      client: new OpenAI({ apiKey: openaiKey }),
      model: process.env.AI_MODEL || "gpt-3.5-turbo",
      provider: "OpenAI",
    };
  }

  return null;
}

export async function POST(request) {
  try {
    const ai = createAIClient();
    if (!ai) {
      return NextResponse.json(
        {
          error:
            "API ключ не настроен. Добавьте OPENROUTER_API_KEY или OPENAI_API_KEY в файл .env.local",
        },
        { status: 500 },
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Сообщение обязательно для заполнения" },
        { status: 400 },
      );
    }

    // Build messages array
    const messages = [];

    // System prompt
    const systemPrompt =
      "Ты полезный AI-ассистент. Отвечай кратко и по существу. Если пользователь пишет на русском — отвечай на русском.";

    if (Array.isArray(history) && history.length > 0) {
      messages.push({ role: "system", content: systemPrompt });
      for (const msg of history) {
        if (msg.role && msg.content) {
          messages.push({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          });
        }
      }
    } else {
      messages.push({
        role: "user",
        content: `${systemPrompt}\n\nВопрос: ${message}`,
      });
    }

    // Call AI API
    const completion = await ai.client.chat.completions.create({
      model: ai.model,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return NextResponse.json(
        { error: "Пустой ответ от AI" },
        { status: 500 },
      );
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);

    if (error?.status === 401) {
      return NextResponse.json({ error: "Неверный API ключ" }, { status: 401 });
    }
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Превышен лимит запросов. Попробуйте позже." },
        { status: 429 },
      );
    }
    if (error?.status === 503) {
      return NextResponse.json(
        { error: "Сервис временно недоступен. Попробуйте позже." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
