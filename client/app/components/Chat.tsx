"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const markdownComponents: Components = {
  p: ({ children }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-[#c9a96e]">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-[#b8b0a0]">{children}</em>,
  h1: ({ children }) => (
    <h1 className="text-base font-bold text-[#c9a96e] mb-2 mt-3 first:mt-0">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-sm font-bold text-[#c9a96e] mb-2 mt-3 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-sm font-semibold text-[#d4c4a0] mb-1 mt-2 first:mt-0">
      {children}
    </h3>
  ),
  ul: ({ children }) => <ul className="mb-2 space-y-1 pl-1">{children}</ul>,
  ol: ({ children }) => (
    <ol className="mb-2 space-y-1 pl-1 list-decimal list-inside">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="flex gap-2 items-start text-sm">
      <span className="text-[#c9a96e] mt-1.5 shrink-0 w-1 h-1 rounded-full bg-[#c9a96e] block" />
      <span>{children}</span>
    </li>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    return isBlock ? (
      <code className="block bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg px-4 py-3 text-xs text-[#c9a96e] font-mono overflow-x-auto my-2 whitespace-pre">
        {children}
      </code>
    ) : (
      <code className="bg-[#0a0a0a] border border-[#2a2a2a] rounded px-1.5 py-0.5 text-xs text-[#c9a96e] font-mono">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="my-2 rounded-lg overflow-hidden">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-[#c9a96e] pl-3 my-2 text-[#888] italic text-sm">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="border-[#2a2a2a] my-3" />,
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#c9a96e] underline underline-offset-2 hover:text-[#d4b87a] transition-colors"
    >
      {children}
    </a>
  ),
};

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! Upload a file on the left and I'll help you analyze it.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px";
  }, [input]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };

    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMsg,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      },
    ]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmed }),
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      if (!response.body) throw new Error("Response body is null");
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");

        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const event = JSON.parse(line.slice(6)); 
            if (event.token) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: m.content + event.token }
                    : m,
                ),
              );
            }
          } catch {
            // Malformed JSON line — skip silently
          }
        }
      }
    } catch (err) {
      console.error("[Chat] Stream error:", err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: `Error: ${err instanceof Error ? err.message : "Unknown error"}`,
              }
            : m,
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="flex flex-col h-full bg-[#0f0f0f] text-[#e8e4dc] font-['Georgia',serif]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#2a2a2a] flex items-center gap-3 bg-[#0f0f0f]">
        <div className="w-2 h-2 rounded-full bg-[#c9a96e] animate-pulse" />
        <span className="text-sm tracking-[0.2em] uppercase text-[#c9a96e] font-['Georgia',serif]">
          Assistant
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-thin scrollbar-thumb-[#2a2a2a]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5
                ${
                  msg.role === "assistant"
                    ? "bg-[#c9a96e] text-[#0f0f0f]"
                    : "bg-[#2a2a2a] text-[#c9a96e] border border-[#3a3a3a]"
                }`}
            >
              {msg.role === "assistant" ? "AI" : "U"}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[75%] space-y-1 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}
            >
              <div
                className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
                  ${
                    msg.role === "assistant"
                      ? "bg-[#1a1a1a] border border-[#2a2a2a] text-[#e8e4dc] rounded-tl-sm"
                      : "bg-[#c9a96e] text-[#0f0f0f] rounded-tr-sm"
                  }`}
              >
                {msg.role === "assistant" ? (
                  <ReactMarkdown components={markdownComponents}>
                    {
                      msg.content ||
                        "​" 
                    }
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
              <span
                className="text-[10px] text-[#444] px-1"
                suppressHydrationWarning
              >
                {formatTime(msg.timestamp)}
              </span>
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-[#c9a96e] shrink-0 flex items-center justify-center text-xs font-bold text-[#0f0f0f]">
              AI
            </div>
            <div className="bg-[#1a1a1a] border border-[#2a2a2a] px-4 py-3 rounded-2xl rounded-tl-sm">
              <div className="flex gap-1.5 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#c9a96e] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t border-[#2a2a2a] bg-[#0f0f0f]">
        <div className="flex gap-3 items-end bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl px-4 py-3 focus-within:border-[#c9a96e] transition-colors duration-200">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-[#e8e4dc] placeholder-[#444] leading-relaxed max-h-40 font-['Georgia',serif]"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-full bg-[#c9a96e] flex items-center justify-center shrink-0 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#d4b87a] transition-colors duration-150 mb-0.5"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-4 h-4 text-[#0f0f0f] -rotate-90"
            >
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-[#333] text-center mt-2 tracking-widest uppercase">
          Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}
