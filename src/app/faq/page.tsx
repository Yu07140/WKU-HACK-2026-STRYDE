"use client";

import Link from "next/link";
import {
  Truck,
  RotateCcw,
  Ruler,
  Globe2,
  CreditCard,
  MessageCircle,
  ArrowRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/store/lang";

type QA = { q: string; a: string };

export default function FAQPage() {
  const { t } = useLang();

  const FAQS: Array<{ cat: string; slug: string; icon: any; items: QA[] }> = [
    {
      cat: t("Shipping & Delivery", "配送与物流"),
      slug: "shipping-delivery",
      icon: Truck,
      items: [
        {
          q: t("How long does shipping take?", "配送需要多久？"),
          a: t(
            "Orders are produced in 3–5 business days, then international transit takes 8–15 days (estimate). See the full timeline on our Shipping page.",
            "订单生产需 3–5 个工作日，国际运输另需约 8–15 天（预估）。完整时效请查看配送页面。"
          ),
        },
        {
          q: t("Do you ship internationally?", "是否支持国际配送？"),
          a: t(
            "Yes — we ship worldwide from our factory, except a small number of restricted regions. Rates are flat by zone: $7.90 US, $12.50 UK/EU, $14.90 Canada/Australia.",
            "支持——我们从工厂直发全球，仅少数受限地区除外。分区统一运费：美国 $7.90，英国/欧盟 $12.50，加拿大/澳大利亚 $14.90。"
          ),
        },
        {
          q: t("Is there free shipping?", "有免运费吗？"),
          a: t(
            "Shipping is free on US orders over $75; otherwise a $7.90 flat rate applies at checkout.",
            "美国订单满 $75 免运费；否则结算时收取 $7.90 统一运费。"
          ),
        },
      ],
    },
    {
      cat: t("Returns & Exchanges", "退货与换货"),
      slug: "returns-exchanges",
      icon: RotateCcw,
      items: [
        {
          q: t("What's your return policy?", "退货政策是什么？"),
          a: t(
            "STRYDE offers a 30-day guarantee on your first pair. To start a return, email returns@stryde.com within 30 days of delivery.",
            "STRYDE 为你的第一双提供 30 天质保。如需退货，请在收货后 30 天内邮件 returns@stryde.com。"
          ),
        },
        {
          q: t("The shoes don't fit. Can I exchange them?", "尺码不合适，可以换货吗？"),
          a: t(
            "Email returns@stryde.com within your 30-day window and we'll help you get the right size. Use the Size Guide to measure your foot first.",
            "请在 30 天质保期内邮件 returns@stryde.com，我们会帮你换到合适的尺码。下单前先用尺码指南量脚。"
          ),
        },
      ],
    },
    {
      cat: t("Sizing & Fit", "尺码与合脚"),
      slug: "sizing-fit",
      icon: Ruler,
      items: [
        {
          q: t("What size should I get?", "我该选什么尺码？"),
          a: t(
            "14534-H is supplied in EU sizes 38–46. Use the measurement guide and confirm your size before ordering.",
            "14534-H 提供 EU 38–46 码。请使用测量指南，下单前确认你的尺码。"
          ),
        },
        {
          q: t("How do I care for the boots?", "如何保养这双靴子？"),
          a: t(
            "We're finalizing care guidance for the 14534-H and will publish it before launch. Until then, feel free to ask us in the chat bubble.",
            "我们正在完善 14534-H 的保养指引，并会在发售前公布。在此之前，欢迎在右下角聊天中咨询我们。"
          ),
        },
      ],
    },
    {
      cat: t("Material", "材质"),
      slug: "material",
      icon: Layers,
      items: [
        {
          q: t("What is 14534-H made of?", "14534-H 由什么材质制成？"),
          a: t(
            "The official supplier specification lists a microfiber upper and microfiber lining with a rubber outsole. It is not genuine leather.",
            "官方供应商规格为超纤革鞋面与超纤革内里，搭配橡胶外底。并非真皮。"
          ),
        },
        {
          q: t("Is this genuine leather?", "这是真皮吗？"),
          a: t("No. The official supplier specification lists a microfiber upper.", "不是。官方供应商规格为超纤革鞋面。"),
        },
      ],
    },
    {
      cat: t("Duties, Taxes & Customs", "关税、税费与清关"),
      slug: "duties-taxes-customs",
      icon: Globe2,
      items: [
        {
          q: t("Will I have to pay customs or import duties?", "需要支付关税或进口税费吗？"),
          a: t(
            "All orders ship DDU (Delivered Duty Unpaid): import duties and taxes are not included in your order total and are the customer's responsibility on delivery. See our Shipping page for details.",
            "所有订单均以 DDU（未完税交货）方式发出：进口关税与税费不包含在订单总额中，配送时由客户自行承担。详情请查看配送页面。"
          ),
        },
      ],
    },
    {
      cat: t("Payment", "支付"),
      slug: "payment",
      icon: CreditCard,
      items: [
        {
          q: t("What payment methods do you accept?", "支持哪些支付方式？"),
          a: t(
            "Payment methods accepted at checkout are determined by the payment gateway. This is a demo store — supported methods have not been verified for production.",
            "结算时支持的支付方式由支付网关决定。这是一个演示商店——支持的支付方式尚未在生产环境中核实。"
          ),
        },
        {
          q: t("Is it safe to enter my card info here?", "在这里输入银行卡信息安全吗？"),
          a: t(
            "This is a demo prototype. Please do not enter real payment information. In production, payments would be processed by a secure payment provider.",
            "这是一个演示原型。请勿输入真实支付信息。生产环境中，支付将由安全的支付服务商处理。"
          ),
        },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      {/* ---------- HERO ---------- */}
      <div className="mb-14 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-bold tracking-wider text-ink/70">
          <MessageCircle size={13} className="text-accent" />
          {t("HELP CENTER", "帮助中心")}
        </div>
        <h1 className="text-5xl font-black leading-[1.05] tracking-tight md:text-6xl">
          {t("Questions?", "有疑问？")}
          <br />
          <span className="text-accent">{t("Honest answers.", "坦诚作答。")}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-ink/55">
          {t(
            "Can't find what you need? Ping the chat bubble in the bottom right.",
            "找不到想要的答案？点击右下角的聊天气泡。"
          )}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-xs text-ink/40">
          {t(
            "Demo store — shipping estimates and payment handling are for this demo. The 30-Day Guarantee on your first pair is a confirmed STRYDE policy.",
            "演示商店——配送预估与支付处理仅用于演示。首双 30 天质保为已确认的 STRYDE 政策。"
          )}
        </p>
      </div>

      {/* ---------- 分类 ---------- */}
      <div className="space-y-14">
        {FAQS.map(({ cat, slug, icon: Icon, items }) => (
          <section key={slug} id={slug}>
            <div className="mb-5 flex items-center gap-3">
              <div className="inline-flex rounded-xl bg-accent/10 p-2 text-accent">
                <Icon size={20} />
              </div>
              <h2 className="text-2xl font-black">{cat}</h2>
            </div>
            <div className="divide-y divide-ink/10 rounded-3xl border border-ink/10 bg-white">
              {items.map(({ q, a }) => (
                <details
                  key={q}
                  className="group p-6 open:bg-paper/50 first:rounded-t-3xl last:rounded-b-3xl"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-bold">
                    <span>{q}</span>
                    <span className="text-accent text-xl transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-ink/65 leading-relaxed">{a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* ---------- CTA ---------- */}
      <section className="mt-20 rounded-3xl bg-ink p-10 text-center text-paper md:p-14">
        <h2 className="text-3xl font-black md:text-4xl">{t("Still not sure?", "还有疑问？")}</h2>
        <p className="mx-auto mt-3 max-w-lg text-paper/60">
          {t("Read the size guide before you buy.", "购买前请阅读尺码指南。")}
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/size-guide">
            <Button size="lg" variant="primary">
              {t("Size Guide", "尺码指南")} <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
