"use client";

import { Suspense, useState } from "react";
import {
  ImageIcon,
  PenLine,
  LayoutGrid,
  Sparkles,
  Clapperboard,
  History,
  Palette,
  Lock,
} from "lucide-react";
import { SceneGenerator } from "@/components/studio/SceneGenerator";
import { CopyGenerator } from "@/components/studio/CopyGenerator";
import { CreativeMatrix } from "@/components/studio/CreativeMatrix";
import { VideoScriptGenerator } from "@/components/studio/VideoScriptGenerator";
import { BrandKitCard } from "@/components/studio/BrandKitCard";
import { CreativeHistory } from "@/components/studio/CreativeHistory";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { cn } from "@/lib/utils";
import { Label, Select } from "@/components/ui/input";
import { useLang } from "@/lib/store/lang";

const TABS = [
  { id: "scene", label: "Product Creative", icon: ImageIcon },
  { id: "copy", label: "Ad Copy", icon: PenLine },
  { id: "matrix", label: "Creative Matrix", icon: LayoutGrid },
  { id: "video", label: "Video Script", icon: Clapperboard },
  { id: "brand", label: "Brand Kit", icon: Palette },
  { id: "history", label: "Creative History", icon: History },
] as const;

const TAB_LABEL_CN: Record<(typeof TABS)[number]["id"], string> = {
  scene: "产品创意",
  copy: "广告文案",
  matrix: "创意矩阵",
  video: "视频脚本",
  brand: "品牌套件",
  history: "创意历史",
};

type TabId = (typeof TABS)[number]["id"];

/** Campaign objectives (spec §17). CLIPS / CARE are concept-stage — never BUY NOW. */
const OBJECTIVES = [
  {
    id: "core",
    label: "Core Product",
    labelCn: "核心单品",
    cta: "SHOP NOW",
    type: "TRANSACTION",
    hooks: ["STAND UP. STAND OUT.", "ONE BOOT. THREE ROUTINES."],
  },
  {
    id: "duo",
    label: "Duo",
    labelCn: "双鞋组合",
    cta: "BUILD YOUR DUO",
    type: "BUNDLE / AOV",
    hooks: ["TWO PAIRS. ONE ROTATION."],
  },
  {
    id: "clips",
    label: "STRYDE CLIPS",
    labelCn: "STRYDE CLIPS",
    cta: "EXPLORE STRYDE CLIPS",
    type: "DESIGN PREVIEW",
    hooks: ["MAKE IT YOURS.", "SAME BOOT. YOUR DETAIL.", "SMALL DETAIL. BIG SIGNATURE."],
  },
  {
    id: "care",
    label: "Care 01",
    labelCn: "Care 01",
    cta: "COMING NEXT",
    type: "DESIGN PREVIEW",
    hooks: ["KEEP THE ROUTE GOING."],
  },
] as const;

const OBJECTIVE_TYPE_CN: Record<string, string> = {
  TRANSACTION: "交易转化",
  "BUNDLE / AOV": "套装客单",
  "DESIGN PREVIEW": "设计预览",
};

export default function StudioWorkspace() {
  const { t } = useLang();
  const [tab, setTab] = useState<TabId>("scene");
  const [draftPrompt, setDraftPrompt] = useState<string | undefined>(undefined);
  const [objective, setObjective] = useState<string>("core");
  const obj = OBJECTIVES.find((o) => o.id === objective) ?? OBJECTIVES[0];

  /** Creative History → Product Creative：复用 prompt */
  function reusePrompt(prompt: string) {
    setDraftPrompt(prompt);
    setTab("scene");
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-paper">
          <Sparkles size={22} />
        </span>
        <div>
          <h1 className="text-3xl font-black">{t("Creative Studio", "创意工作室")}</h1>
          <p className="text-sm font-semibold tracking-wider text-ink/50">
            {t("REAL PRODUCT. FASTER CREATIVE.", "真实产品 · 更快出创意")}
          </p>
        </div>
      </div>

      {/* ---------- CAMPAIGN OBJECTIVE ---------- */}
      <div className="mt-8 rounded-2xl border border-ink/10 bg-white p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-56 flex-1">
            <Label>{t("Campaign Objective", "营销目标")}</Label>
            <Select value={objective} onChange={(e) => setObjective(e.target.value)}>
              {OBJECTIVES.map((o) => (
                <option key={o.id} value={o.id}>
                  {t(o.label, o.labelCn)}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-wrap gap-2">
            {obj.hooks.map((h) => (
              <span
                key={h}
                className="rounded-full bg-cream px-3 py-1.5 text-xs font-black tracking-wide text-ink/70"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
          <span className="rounded-full bg-ink/90 px-3 py-1 font-black tracking-wider text-paper">
            {t(obj.type, OBJECTIVE_TYPE_CN[obj.type] ?? obj.type)}
          </span>
          <span className="font-bold text-ink/60">
            CTA: <span className="text-ink">{obj.cta}</span>
          </span>
          {obj.type === "DESIGN PREVIEW" && (
            <span className="text-amber-600 font-semibold">
              {t(
                "Concept-stage — no BUY NOW / Add to Cart allowed.",
                "概念阶段 — 不可出现 BUY NOW / 加购引导。"
              )}
            </span>
          )}
        </div>
      </div>

      <div className="mt-8 inline-flex max-w-full flex-wrap rounded-full border border-ink/15 bg-white p-1">
        {TABS.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition",
              tab === tb.id ? "bg-ink text-paper" : "text-ink/60 hover:text-ink"
            )}
          >
            <tb.icon size={16} /> {t(tb.label, TAB_LABEL_CN[tb.id])}
          </button>
        ))}
      </div>

      {/* ---------- REFERENCE LOCK ---------- */}
      <ReferenceLock />

      {/* useSearchParams() 需要 Suspense 边界（Next.js App Router 静态渲染要求） */}
      <Suspense fallback={null}>
        <div className="mt-8">
          {tab === "scene" && (
            <SceneGenerator
              draftPrompt={draftPrompt}
              onDraftConsumed={() => setDraftPrompt(undefined)}
            />
          )}
          {tab === "copy" && <CopyGenerator />}
          {tab === "matrix" && <CreativeMatrix />}
          {tab === "video" && <VideoScriptGenerator />}
          {tab === "brand" && <BrandKitCard />}
          {tab === "history" && <CreativeHistory onReusePrompt={reusePrompt} />}
        </div>
      </Suspense>
    </div>
  );
}

/** REFERENCE LOCK: 工厂实拍 vs AI 创意，产品参考锁定 */
function ReferenceLock() {
  const { t } = useLang();
  const hero = getProductById("boot-14534-h");
  return (
    <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-bold text-green-700">
          <Lock size={12} /> {t("REFERENCE LOCK: ON", "参考锁定：开启")}
        </span>
        <span className="text-xs text-ink/50">
          {t(
            "SKU 14534-H — product reference locked to factory photography",
            "SKU 14534-H — 产品参考已锁定为工厂实拍"
          )}
        </span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-ink/10">
            {hero && (
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.imagePrompt}
                alt={t("Factory reference", "工厂实拍参考")}
                size="landscape_4_3"
                className="h-full w-full"
              />
            )}
          </div>
          <div className="mt-2 text-center text-xs font-bold">
            {t("FACTORY REFERENCE IMAGE", "工厂实拍参考图")}
          </div>
        </div>
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-accent/30 bg-cream">
            {hero && (
              <ProductImage
                src={hero.heroImage ?? hero.image}
                prompt={hero.creativePresets?.ad ?? hero.imagePrompt}
                alt={t("AI creative", "AI 创意")}
                size="landscape_4_3"
                className="h-full w-full"
              />
            )}
          </div>
          <div className="mt-2 text-center text-xs font-bold text-accent-dark">
            {t("AI-GENERATED CREATIVE", "AI 生成创意")}
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-ink/55">
        {t(
          "The factory product remains the source of truth. AI generates the campaign direction — not a fictional sellable SKU.",
          "工厂实拍产品始终是唯一事实来源。AI 只生成营销创意方向 — 不虚构可售 SKU。"
        )}
      </p>
    </div>
  );
}
