"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { MiniProductCard } from "@/components/store/ProductCard";
import type { Product } from "@/lib/types";
import { AGENT_PERSONA, type Lang } from "@/lib/ai/agent";
import { aiImageUrl } from "@/lib/ai/image";

interface Msg {
  role: "user" | "ai";
  text: string;
  /** 允许 id（SSE 新增）+ 其他展示字段 */
  products?: (Pick<Product, "id" | "slug" | "name" | "price" | "rating" | "imagePrompt"> & {
    image?: string;
  })[];
}

/** AI 导购头像（文生图） */
const AVATAR_URL = aiImageUrl(
  "friendly young female AI shopping assistant avatar, warm smile, modern minimal style, soft studio lighting, circular portrait",
  "square"
);

/** 聊天记录 localStorage 持久化 key */
const STORAGE_KEY = "stryde-agent-msgs";
/** 主动搭话只触发一次的持久化标记 key */
const PROACTIVE_KEY = "stryde-agent-proactive-sent";

/** 判断一条 AI 消息是否为主动搭话（前缀匹配，兼容历史版本文案变体） */
function isProactiveMsg(t: string): boolean {
  return t.startsWith(AGENT_PERSONA.proactive) || t.startsWith(AGENT_PERSONA.proactiveZh);
}

/** 判断一条 AI 消息是否为欢迎语（前缀匹配，兼容历史版本文案变体） */
function isWelcomeMsg(t: string): boolean {
  return t.startsWith("Hey! I'm Mia") || t.startsWith("嘿！我是 Mia");
}

export function AgentWidget() {
  // 首渲染固定双语欢迎语（中英各一段，无 SSR/hydration 不一致问题）；挂载后再按浏览器语言切换
  const [lang, setLang] = useState<Lang>("en");
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: AGENT_PERSONA.welcomeBilingual },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const interactedRef = useRef(false);
  const proactiveSentRef = useRef(false);
  /** msgs 的实时镜像（供定时器闭包读取最新值，避免 setState 函数里做副作用） */
  const msgsRef = useRef<Msg[]>(msgs);

  /* 挂载后：按浏览器语言切换 + 恢复本地聊天记录 + 恢复主动搭话标记（仅客户端执行） */
  useEffect(() => {
    const browserLang: Lang =
      typeof navigator !== "undefined" && /^zh/i.test(navigator.language) ? "zh" : "en";
    setLang(browserLang);
    try {
      if (localStorage.getItem(PROACTIVE_KEY) === "1") proactiveSentRef.current = true;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Msg[];
        if (Array.isArray(parsed) && parsed.length) {
          // 旧数据自愈：主动搭话只保留第一条并升级为双语版；首条欢迎语（含历史版本文案）升级为双语版
          let seenProactive = false;
          const healed: Msg[] = [];
          for (const m of parsed) {
            if (m.role === "ai" && isProactiveMsg(m.text)) {
              if (seenProactive) continue;
              seenProactive = true;
              healed.push({ ...m, text: AGENT_PERSONA.proactiveBilingual });
              continue;
            }
            healed.push(m);
          }
          if (healed[0]?.role === "ai" && isWelcomeMsg(healed[0].text)) {
            healed[0] = { role: "ai", text: AGENT_PERSONA.welcomeBilingual };
          }
          setMsgs(healed);
          return;
        }
      }
    } catch {
      /* 持久化失败不影响功能 */
    }
    // 无历史记录时，把默认欢迎语替换成浏览器语言版本
    setMsgs([
      { role: "ai", text: browserLang === "zh" ? AGENT_PERSONA.welcomeZh : AGENT_PERSONA.welcome },
    ]);
  }, []);

  /* 聊天记录持久化 + 同步镜像 */
  useEffect(() => {
    msgsRef.current = msgs;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
    } catch {
      /* 存储满/隐私模式下静默失败 */
    }
  }, [msgs]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  /* 打开面板后 30 秒无交互 → 主动搭话（持久化标记 + 历史去重，最多只出现一条） */
  useEffect(() => {
    if (!open) return;
    if (interactedRef.current || proactiveSentRef.current) return;
    timerRef.current = setTimeout(() => {
      if (interactedRef.current || proactiveSentRef.current) return;
      // 历史记录里已经有主动搭话（旧数据自愈）→ 不再追加，只补标记
      const already = msgsRef.current.some((x) => x.role === "ai" && isProactiveMsg(x.text));
      if (already) {
        proactiveSentRef.current = true;
        try {
          localStorage.setItem(PROACTIVE_KEY, "1");
        } catch {
          /* 忽略 */
        }
        return;
      }
      proactiveSentRef.current = true;
      try {
        localStorage.setItem(PROACTIVE_KEY, "1");
      } catch {
        /* 忽略 */
      }
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text: AGENT_PERSONA.proactiveBilingual,
        },
      ]);
    }, 30_000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [open, lang]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || typing) return;
    interactedRef.current = true;
    if (timerRef.current) clearTimeout(timerRef.current);
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: content }]);
    setTyping(true);

    // 多轮上下文：取最近一条带商品卡的 AI 回复，把 slug 列表传给后端
    const lastRecs = [...msgs].reverse().find((m) => m.role === "ai" && m.products?.length);
    const lastRecommendedSlugs = lastRecs?.products?.map((p) => p.slug) ?? [];

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, lastRecommendedSlugs }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiText = "";
      let products: Msg["products"];

      // 先插入空的 AI 气泡，流式往里填
      setMsgs((m) => [...m, { role: "ai", text: "" }]);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const evt = JSON.parse(line);
          if (evt.type === "text") {
            aiText += evt.v;
            setMsgs((m) => {
              const copy = [...m];
              copy[copy.length - 1] = { role: "ai", text: aiText };
              return copy;
            });
          } else if (evt.type === "products") {
            products = evt.v;
          }
        }
      }
      if (products?.length) {
        setMsgs((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "ai", text: aiText, products };
          return copy;
        });
      }
    } catch {
      setMsgs((m) => [
        ...m,
        {
          role: "ai",
          text:
            lang === "zh"
              ? "抱歉，助手暂时开小差了，请稍后再试一下～"
              : "Sorry, the assistant is unavailable right now. Please try again shortly.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  // 快捷气泡：用户还没发过第一条消息前一直显示（含主动搭话出现后），发过即隐藏
  const suggestions = AGENT_PERSONA.suggestionsBilingual;
  const showSuggestions = !msgs.some((m) => m.role === "user");

  return (
    <>
      {/* 悬浮按钮 */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-accent text-white shadow-lg shadow-accent/30 transition hover:scale-105"
        aria-label="Open AI shopping assistant"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[540px] w-[min(92vw,380px)] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl animate-fade-up">
          {/* 头部 */}
          <div className="flex items-center gap-3 bg-ink px-5 py-4 text-paper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={AVATAR_URL}
              alt={AGENT_PERSONA.name}
              className="h-9 w-9 rounded-full border border-paper/20 object-cover"
            />
            <div>
              <div className="text-sm font-black">{AGENT_PERSONA.headerTitle}</div>
              <div className="flex items-center gap-1.5 text-xs text-paper/60">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                {lang === "zh" ? AGENT_PERSONA.headerStatusZh : AGENT_PERSONA.headerStatus}
              </div>
            </div>
          </div>

          {/* 消息区 */}
          <div ref={bodyRef} className="thin-scroll flex-1 space-y-4 overflow-y-auto bg-paper p-4">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-md bg-ink px-4 py-2.5 text-sm text-paper"
                      : "max-w-[92%] rounded-2xl rounded-bl-md border border-ink/10 bg-white px-4 py-2.5 text-sm text-ink/85"
                  }
                >
                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  {m.products?.map((p) => (
                    <div key={p.slug} className="space-y-1.5">
                      <MiniProductCard product={p} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {typing && msgs[msgs.length - 1]?.role === "user" && (
              <div className="flex gap-1.5 px-2 pt-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="typing-dot h-2 w-2 rounded-full bg-ink/40"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 建议问题 */}
          {showSuggestions && (
            <div className="flex flex-wrap gap-1.5 border-t border-ink/10 bg-white px-3 pt-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-semibold text-ink/70 transition hover:border-accent hover:text-accent-dark"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* 输入区 */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-ink/10 bg-white p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={AGENT_PERSONA.inputPlaceholderBilingual}
              className="h-10 flex-1 rounded-full bg-paper px-4 text-sm outline-none placeholder:text-ink/40"
            />
            <button
              type="submit"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white transition hover:bg-accent-dark"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
