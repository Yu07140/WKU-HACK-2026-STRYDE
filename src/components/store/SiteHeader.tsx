"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag, Globe, User } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useCurrency, CURRENCIES, type CurrencyCode } from "@/lib/store/currency";
import { useLang } from "@/lib/store/lang";
import { BRAND } from "@/lib/data/brand";

export function SiteHeader() {
  const { count } = useCart();
  const { currency, setCurrency } = useCurrency();
  const { lang, setLang, t } = useLang();
  const [username, setUsername] = useState<string | null>(null);

  // 登录态由服务端会话判定（httpOnly Cookie），刷新/跨浏览器均有效
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d) => setUsername(d.user?.username ?? null))
      .catch(() => setUsername(null));
  }, []);

  const NAV = [
    { href: "/products/mono-boot", label: t("The Boot", "主打靴款") },
    { href: "/products", label: t("The System", "产品系统") },
    { href: "/about", label: t("Story", "品牌故事") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-black tracking-[0.18em]">
          {BRAND.name}
          <span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex items-center gap-1.5 text-sm font-semibold text-ink/70 transition hover:text-ink"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* 币种切换 */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="cursor-pointer rounded-md border border-ink/10 bg-white px-2 py-1 text-xs font-semibold text-ink/70 transition hover:border-ink/30 focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Select currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.symbol} {c.code}
              </option>
            ))}
          </select>
          {/* 语言切换 */}
          <button
            onClick={() => setLang(lang === "EN" ? "CN" : "EN")}
            className="flex items-center gap-1 rounded-md border border-ink/10 bg-white px-2 py-1 text-xs font-semibold text-ink/70 transition hover:border-ink/30 focus:outline-none focus:ring-1 focus:ring-accent"
            aria-label="Switch language"
          >
            <Globe size={13} className="text-accent" />
            {lang === "EN" ? "EN" : "中文"}
          </button>
          <Link
            href={username ? "/account" : "/account/login"}
            className="flex items-center gap-1.5 rounded-full p-2 text-ink transition hover:bg-ink/5"
            title={username ? t("My account", "我的账户") : t("Sign in / Register", "登录 / 注册")}
          >
            <User size={20} />
            {username && (
              <span className="hidden max-w-24 truncate text-xs font-bold text-ink/70 lg:inline">
                {username}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            className="relative rounded-full p-2 text-ink transition hover:bg-ink/5"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
