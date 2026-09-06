"use client";

import Link from "next/link";
import { ArrowRight, Package, Sparkles, Compass } from "lucide-react";
import { getProductById } from "@/lib/data/catalog";
import { ProductImage } from "@/components/ui/ProductImage";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/store/lang";

export default function AboutPage() {
  const { t } = useLang();
  const featured = getProductById("boot-14534-h");

  const PILLARS = [
    {
      icon: Package,
      title: t("PRODUCT", "产品"),
      items: [
        t("Real factory SKU", "真实工厂 SKU"),
        t("Real material", "真实材质"),
        t("Real construction", "真实工艺"),
      ],
    },
    {
      icon: Sparkles,
      title: t("PROCESS", "流程"),
      items: [
        t("AI-assisted creative", "AI 辅助创意"),
        t("Copy", "文案"),
        t("Product discovery", "产品发掘"),
        t("Market testing", "市场测试"),
      ],
    },
    {
      icon: Compass,
      title: t("PRINCIPLE", "原则"),
      items: [t("Move faster.", "更快行动。"), t("Stay honest.", "保持坦诚。")],
    },
  ];

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 md:grid-cols-2 md:py-24">
          <div>
            <div className="mb-4 text-xs font-bold tracking-[0.3em] text-ink/40">STRYDE</div>
            <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
              STAND UP.
              <br />
              <span className="text-ink/80">STAND OUT.</span>
            </h1>
            <div className="mt-5 text-lg font-semibold text-ink/60">
              {t("ONE REAL PRODUCT. A FASTER WAY TO MARKET.", "一款真实产品。一条更快的上市之路。")}
            </div>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink/65">
              {t(
                "STRYDE began with a simple idea: a good product should not need months of traditional brand-building before it can meet its customer.",
                "STRYDE 源于一个简单的想法：好产品不该先经历数月的传统品牌打造，才能见到它的顾客。"
              )}
            </p>
            <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink/65">
              {t(
                "We start with a real footwear product and use an AI-assisted creative and commerce workflow to move faster — from positioning and campaign concepts to product discovery and checkout.",
                "我们从一个真实的鞋履产品出发，借助 AI 辅助的创意与电商流程加速前行——从定位与广告创意，到产品发掘与结算。"
              )}
            </p>
            <p className="mt-4 max-w-lg text-lg font-medium leading-relaxed text-ink/80">
              {t("The product stays real. The process gets smarter.", "产品保持真实。流程更加聪明。")}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/products/mono-boot">
                <Button size="lg">
                  {t("Shop the boot", "选购这双靴子")} <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
          {featured && (
            <ProductImage
              src={featured.heroImage ?? featured.image}
              prompt={featured.imagePrompt}
              alt={t("STRYDE 14534-H — black minimalist ankle boot", "STRYDE 14534-H——黑色极简短靴")}
              size="landscape_4_3"
              className="aspect-[4/3] rounded-3xl shadow-2xl"
            />
          )}
        </div>
      </section>

      {/* ---------- PRODUCT / PROCESS / PRINCIPLE ---------- */}
      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, items }) => (
              <div key={title} className="rounded-3xl bg-white p-8">
                <div className="mb-5 inline-flex rounded-2xl bg-ink/5 p-3 text-ink">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-black tracking-wide">{title}</h3>
                <ul className="mt-4 space-y-2.5 text-ink/65">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/40" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h2 className="text-4xl font-black leading-tight md:text-5xl">
          {t("The boot built for the way your day moves.", "为你的日常步伐而生的靴子。")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-ink/55">
          {t(
            "14534-H — microfiber upper, rear zipper, rubber outsole. Sizes EU 38–46.",
            "14534-H——超纤革鞋面、后跟拉链、橡胶外底。尺码 EU 38–46。"
          )}
        </p>
        <div className="mt-8">
          <Link href="/products/mono-boot">
            <Button size="lg">
              {t("SHOP THE BOOT", "选购这双靴子")} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
