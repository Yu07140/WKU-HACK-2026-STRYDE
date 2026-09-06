"use client";

import StudioWorkspace from "@/components/studio/StudioWorkspace";

export default function AdminStudioPage() {
  return (
    <div>
      {/* 内部工坊入口头 — 低调、管理后台风格 */}
      <div className="mb-4 border-b border-white/10 pb-3">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
          STRYDE ADMIN / AI CREATIVE STUDIO
        </div>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Internal campaign production workspace
        </p>
      </div>

      {/* Studio 按独立站浅色画布渲染，内部样式不动 */}
      <div className="overflow-hidden rounded-2xl bg-paper text-ink">
        <StudioWorkspace />
      </div>
    </div>
  );
}
