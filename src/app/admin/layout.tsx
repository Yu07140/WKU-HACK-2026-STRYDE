import Link from "next/link";
import {
  LayoutDashboard,
  Megaphone,
  ShoppingBag,
  FlaskConical,
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  Warehouse,
} from "lucide-react";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "增长总览", icon: LayoutDashboard },
  { href: "/admin/campaigns", label: "投放冷启动", icon: Megaphone },
  { href: "/admin/orders", label: "交易闭环", icon: ShoppingBag },
  { href: "/admin/stock", label: "温州库存", icon: Warehouse },
  { href: "/admin/selection", label: "AI 选款测试", icon: FlaskConical },
  { href: "/admin/studio", label: "AI 创意工坊", icon: Sparkles },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-200">
      {/* ===== 模拟数据醒目横幅 ===== */}
      <div className="border-b border-amber-400/30 bg-amber-500/15">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-5 py-3">
          <AlertTriangle size={20} className="shrink-0 text-amber-400" />
          <p className="text-sm font-bold text-amber-200">
            SIMULATED DATASET
          </p>
          <p className="hidden text-xs text-amber-200/70 md:inline">
            Dashboard workflow demonstration — not real campaign results.
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] gap-8 px-5 py-8">
        {/* 侧边栏 */}
        <aside className="hidden w-56 shrink-0 md:block">
          <Link href="/" className="flex items-center gap-2 text-lg font-black tracking-[0.15em] text-white">
            STRYDE<span className="text-accent">.</span>
          </Link>
          <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-slate-500">
            Growth Console
          </div>
          <nav className="mt-8 space-y-1">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <n.icon size={17} /> {n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 space-y-1">
            <Link
              href="/admin/studio"
              className="flex items-center gap-3 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm font-bold text-accent transition hover:bg-accent/20"
            >
              <Sparkles size={17} /> AIGC 素材工坊
            </Link>
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-400 transition hover:text-white"
            >
              <ArrowLeft size={17} /> 返回独立站
            </Link>
          </div>
        </aside>

        {/* 移动端顶栏 */}
        <div className="fixed inset-x-0 top-16 z-30 flex gap-1 overflow-x-auto border-b border-white/10 bg-[#0b0e14]/95 px-4 py-2 backdrop-blur md:hidden">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-slate-300"
            >
              <n.icon size={14} /> {n.label}
            </Link>
          ))}
        </div>

        <main className="min-w-0 flex-1 pt-12 md:pt-0">{children}</main>
      </div>
    </div>
  );
}
