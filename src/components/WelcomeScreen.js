import ChatBubbleIcon from "./icons/ChatBubbleIcon";

export default function WelcomeScreen() {
  return (
    <div className="flex w-full max-w-2xl flex-col gap-4 items-center text-center animate-fade-in-up px-6">
      {/* Chat icon */}
      <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent shadow-lg shadow-accent/30">
        <ChatBubbleIcon className="h-8 w-8 text-white" />
      </div>

      <h2 className="mb-3 text-xl font-semibold text-blue-200">Привет!</h2>
      <h1 className="mb-4 text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
        Что бы вы хотели узнать?
      </h1>
      <p className="max-w-md text-base leading-relaxed text-blue-300/80">
        Введите вопрос ниже или используйте голосовой ввод
      </p>
    </div>
  );
}
