import "./globals.css";

export const metadata = {
  title: "AI Chat Assistant",
  description:
    "Chat with an AI assistant powered by ChatGPT. Supports text and voice input.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-primary text-white antialiased">{children}</body>
    </html>
  );
}
