"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw, ShoppingBag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CLIP_LETTERS,
  clipLetterImage,
  type ClipLetter,
} from "@/lib/data/strydeClips";
import { useCart } from "@/lib/store/cart";
import { useLang } from "@/lib/store/lang";

/**
 * STRYDE CLIPS — brand personalization module (homepage + PDP).
 * Letter previews use static /clips/letters/{A–Z}.png assets — same 14534-H
 * boot, same studio template, only the silver letter charm changes.
 * - Homepage (StrydeClips): inline hero preview + letter picker.
 * - PDP (ClipCustomizerModal): same letter preview, plus EU size and
 *   SAVE MY CONCEPT — ADD TO CART (adds the real 14534-H boot to the cart
 *   with the letter attached as a personalization note).
 */

const STRYDE_LETTERS = ["S", "T", "R", "Y", "D", "E"];

/**
 * Concept-preview / customizer modal — self-contained and reusable.
 * Used on the homepage (CUSTOMIZE YOUR INITIALS) and on the PDP
 * ("Click here to get personalized").
 */
export function ClipCustomizerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { add } = useCart();
  const { t } = useLang();
  const [letters, setLetters] = useState<ClipLetter[]>(["A"]);
  const [size, setSize] = useState(42);
  const [saved, setSaved] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);

  /* Reset the placeholder/error state whenever the selected letter changes. */
  useEffect(() => {
    setPreviewFailed(false);
  }, [letters[0]]);

  /* Modal: ESC to close + body scroll lock */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  /** Single-letter selection: click a letter to select it, click again to deselect, click another to switch. */
  function toggle(letter: ClipLetter) {
    setSaved(false);
    setLetters((cur) => (cur.includes(letter) ? [] : [letter]));
  }

  /** Save concept → add the real 14534-H boot to cart, letter as personalization note. */
  function saveToCart() {
    const letter = letters[0];
    add({
      productId: "boot-14534-h",
      productName: "STRYDE Mono Boot",
      slug: "mono-boot",
      color: letter ? `Black · Clip ${letter}` : "Black",
      size,
      sizeSystem: "EU",
      price: 119,
      qty: 1,
      imagePrompt:
        "black minimalist men's ankle boot, rear zipper, microfiber upper appearance, rubber outsole, clean realistic commercial footwear photography, no logo, no text",
      image: "/products/14534-h/black.jpg",
    });
    setSaved(true);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="STRYDE CLIPS concept preview"
    >
      <style>{`@keyframes clipFade{from{opacity:0}to{opacity:1}}`}</style>
      <div
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-paper shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink/60 shadow-sm transition hover:text-ink"
        >
          <X size={18} />
        </button>

        {saved ? (
          /* ---------- SAVED (ADDED TO CART) STATE ---------- */
          <div className="flex flex-col items-center px-8 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
              <Check size={26} />
            </span>
            <h3 className="mt-5 text-2xl font-black tracking-wide">
              {t("ADDED TO CART", "已加入购物袋")}
            </h3>
            <p className="mt-2 text-sm text-ink/55">
              STRYDE Mono Boot · EU {size}
              {letters.length > 0 ? ` · Clip ${letters[0]}` : ""}
            </p>
            <p className="mt-4 max-w-sm text-xs leading-relaxed text-ink/40">
              {t(
                "Your initial clip is attached as a personalization note. The clip accessory is coming soon — the boot in your cart is the standard 14534-H.",
                "你的专属字母扣已作为个性化备注附加。字母扣配件即将上线——购物袋中的鞋子为标准款 14534-H。"
              )}
            </p>
            <Link
              href="/cart"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 text-xs font-black tracking-[0.2em] text-paper transition hover:bg-ink/85"
            >
              {t("VIEW CART", "查看购物袋")} <ArrowRight size={14} />
            </Link>
            <button
              onClick={() => setSaved(false)}
              className="mt-4 text-xs font-black tracking-[0.2em] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
            >
              {t("BACK TO EDITOR", "返回编辑")}
            </button>
          </div>
        ) : (
          /* ---------- EDITOR ---------- */
          <div className="p-6 md:p-8">
            <div className="mb-6">
              <div className="text-xs font-bold tracking-[0.3em] text-ink/40">
                {t("MAKE IT YOURS.", "打造你的专属。")}
              </div>
              <h3 className="mt-1 text-2xl font-black">
                {t("Preview your initial clip on the 14534-H.", "在 14534-H 上预览你的专属字母扣。")}
              </h3>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* live letter preview — same studio asset as the homepage picker */}
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-ink/10 bg-white">
                {letters.length > 0 && previewFailed ? (
                  <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold text-ink/40">
                    {t("Letter preview coming soon.", "字母预览即将上线。")}
                  </span>
                ) : letters.length > 0 ? (
                  <img
                    key={letters[0]}
                    src={clipLetterImage(letters[0])}
                    alt={`14534-H boot with silver ${letters[0]} STRYDE Clip preview`}
                    onError={() => setPreviewFailed(true)}
                    className="h-full w-full object-contain"
                    style={{ animation: "clipFade 180ms ease" }}
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center px-6 text-center text-xs font-bold text-ink/40">
                    {t("Pick one letter to preview your clip", "选择一个字母，预览你的字母扣")}
                  </span>
                )}
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold tracking-[0.3em] text-ink/50 shadow-sm">
                  {t("STRYDE CLIP — PREVIEW", "STRYDE 字母扣——预览")}
                </span>
              </div>

              {/* picker + actions */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-black tracking-[0.2em] text-ink/50">
                    {t("YOUR INITIAL", "你的字母")}
                  </span>
                  {letters.length > 0 && (
                    <button
                      onClick={() => {
                        setLetters([]);
                        setSaved(false);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-ink/45 underline-offset-2 hover:text-ink hover:underline"
                    >
                      <RotateCcw size={12} /> {t("RESET", "重置")}
                    </button>
                  )}
                </div>
                <div
                  className="grid grid-cols-7 gap-1.5"
                  role="group"
                  aria-label="Choose your STRYDE Clip letter"
                >
                  {CLIP_LETTERS.map((letter) => {
                    const active = letters[0] === letter;
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => toggle(letter)}
                        aria-pressed={active}
                        aria-label={`Preview STRYDE Clip letter ${letter}`}
                        className={`flex h-9 items-center justify-center rounded-md border text-xs font-bold transition ${
                          active
                            ? "border-ink bg-ink text-paper"
                            : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                        }`}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-3 text-xs text-ink/45">
                  {t("Selected letter", "已选字母")}:{" "}
                  <span className="font-black tracking-widest text-ink">
                    {letters.length > 0 ? letters.join(" ") : "—"}
                  </span>
                </p>

                {/* boot size — required for the cart line */}
                <div className="mt-4">
                  <div className="mb-1.5 text-xs font-black tracking-[0.2em] text-ink/50">
                    {t("BOOT SIZE (EU)", "鞋码（EU）")}
                  </div>
                  <div className="grid grid-cols-9 gap-1.5">
                    {[38, 39, 40, 41, 42, 43, 44, 45, 46].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        aria-pressed={size === s}
                        className={`flex h-8 items-center justify-center rounded-md border text-xs font-bold transition ${
                          size === s
                            ? "border-ink bg-ink text-paper"
                            : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  <button
                    onClick={saveToCart}
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-black tracking-[0.2em] text-paper transition hover:bg-ink/85"
                  >
                    <ShoppingBag size={14} /> {t("SAVE MY STYLE — ADD TO CART", "保存我的风格——加入购物袋")}
                  </button>
                </div>

                <div className="mt-5 rounded-xl bg-cream p-3.5">
                  <p className="text-xs font-black tracking-[0.2em] text-ink/60">
                    {t("COMING SOON", "即将推出")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-ink/45">
                    {t(
                      "Personalized STRYDE Clips are currently in development.",
                      "个性化 STRYDE 字母扣目前正在开发中。"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function StrydeClips() {
  const { t } = useLang();
  const { add } = useCart();
  const [selectedLetter, setSelectedLetter] = useState<ClipLetter>("A");
  const [previewFailed, setPreviewFailed] = useState(false);
  const [size, setSize] = useState<number | null>(null);
  const [added, setAdded] = useState(false);

  const previewImage = clipLetterImage(selectedLetter);

  /* Reset the error state whenever the selected letter changes. */
  useEffect(() => {
    setPreviewFailed(false);
  }, [selectedLetter]);

  /* Preload previous + next letter so switching feels instant. */
  useEffect(() => {
    const i = CLIP_LETTERS.indexOf(selectedLetter);
    const neighbours = [
      CLIP_LETTERS[(i + CLIP_LETTERS.length - 1) % CLIP_LETTERS.length],
      CLIP_LETTERS[(i + 1) % CLIP_LETTERS.length],
    ];
    for (const letter of neighbours) {
      const img = new Image();
      img.src = clipLetterImage(letter);
    }
  }, [selectedLetter]);

  /* Reset "added" whenever letter or size changes. */
  useEffect(() => {
    setAdded(false);
  }, [selectedLetter, size]);

  function addPersonalizedBoot() {
    if (!size) return;
    add({
      productId: "boot-14534-h",
      productName: "STRYDE Mono Boot",
      slug: "mono-boot",
      color: `Black · Clip ${selectedLetter}`,
      size,
      sizeSystem: "EU",
      price: 119,
      qty: 1,
      image: "/products/14534-h/black.jpg",
      imagePrompt:
        "black minimalist men's ankle boot, rear zipper, microfiber upper appearance, rubber outsole, clean realistic commercial footwear photography, no logo, no text",
    });
    setAdded(true);
  }

  return (
    <section id="stryde-clips" className="mx-auto max-w-7xl px-6 py-16 md:py-24">
      <style>{`@keyframes clipFade{from{opacity:0}to{opacity:1}}`}</style>

      {/* ---------- HEADER ---------- */}
      <div className="mb-10">
        <div className="mb-3 text-xs font-bold tracking-[0.3em] text-ink/40">
          {t("MAKE IT YOURS.", "打造你的专属。")}
        </div>
        <h2 className="text-3xl font-black md:text-4xl">STRYDE CLIPS</h2>
        <p className="mt-2 max-w-xl text-ink/55">
          {t(
            "Clip-on letter details designed around the signature front loop structure of the 14534-H.",
            "围绕 14534-H 标志性前部环状结构设计的可拆卸字母扣。可选择 STRYDE 字母，也可以换成你的专属字母，让这双鞋更个人化。"
          )}
        </p>
      </div>

      {/* ---------- HERO — live preview (60%) + letter picker (40%) ---------- */}
      <div className="grid gap-8 lg:grid-cols-5 lg:gap-10">
        {/* live preview — the whole image swaps on click (no letter overlay) */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white">
            {previewFailed ? (
              <div className="flex aspect-[4/5] w-full flex-col items-center justify-center bg-white px-6 text-center">
                <p className="text-xs font-black tracking-[0.2em] text-ink/45">
                  {t("LETTER PREVIEW COMING SOON", "字母预览即将上线")}
                </p>
                <p className="mt-1 text-[11px] text-ink/35">
                  {t("We're adding this letter's final image.", "该字母的最终图片正在添加中。")}
                </p>
              </div>
            ) : (
              <img
                key={selectedLetter}
                src={previewImage}
                alt={`STRYDE 14534-H with silver ${selectedLetter} letter clip preview`}
                width={960}
                height={1200}
                onError={() => setPreviewFailed(true)}
                className="h-auto w-full object-contain"
                style={{ animation: "clipFade 180ms ease" }}
              />
            )}
          </div>
        </div>

        {/* selector + status */}
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-black tracking-wide">{t("MAKE IT PERSONAL", "定制你的专属字母")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/55">
            {t(
              "Choose your letter and make the same 14534-H feel more like yours.",
              "换上你的专属字母，让同一双鞋更有你的味道。"
            )}
          </p>

          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-black tracking-[0.2em] text-ink/50">
                {t("YOUR LETTER · PICK ONE", "选择一个字母")}
              </span>
              <span className="whitespace-nowrap text-xs font-bold tracking-widest text-ink/45">
                {t("YOUR LETTER", "已选字母")}:{" "}
                <span className="font-black text-ink">{selectedLetter}</span>
              </span>
            </div>
            <div
              className="grid grid-cols-7 gap-1.5"
              role="group"
              aria-label="Choose your STRYDE Clip letter"
            >
              {CLIP_LETTERS.map((letter) => {
                const active = selectedLetter === letter;
                return (
                  <button
                    key={letter}
                    type="button"
                    onClick={() => {
                      setPreviewFailed(false);
                      setSelectedLetter(letter);
                    }}
                    aria-pressed={active}
                    aria-label={`Preview STRYDE Clip letter ${letter}`}
                    className={`flex h-9 items-center justify-center rounded-md border text-xs font-bold transition ${
                      active
                        ? "border-ink bg-ink text-paper"
                        : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* add to cart — the real 14534-H with your letter noted */}
          <div className="mt-6 rounded-xl bg-cream p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-xs font-black tracking-[0.2em] text-ink/50">
                {t("BOOT SIZE (EU)", "EU 鞋码")}
              </span>
              <span className="text-sm font-black tracking-wider text-ink">$119</span>
            </div>
            <div className="grid grid-cols-9 gap-1.5">
              {[38, 39, 40, 41, 42, 43, 44, 45, 46].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size === s}
                  className={`flex h-8 items-center justify-center rounded-md border text-xs font-bold transition ${
                    size === s
                      ? "border-ink bg-ink text-paper"
                      : "border-ink/15 bg-white text-ink/70 hover:border-ink/50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={addPersonalizedBoot}
              disabled={!size}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-xs font-black tracking-[0.2em] text-paper transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:bg-ink/30"
            >
              {added ? (
                <>
                  <Check size={14} /> {t("ADDED TO CART", "已加入购物袋")}
                </>
              ) : (
                <>
                  <ShoppingBag size={14} />{" "}
                  {t(
                    `ADD ${selectedLetter} CLIP TO CART`,
                    `加入 ${selectedLetter} 字母扣鞋款`
                  )}
                </>
              )}
            </button>
            {added && (
              <Link
                href="/cart"
                className="mt-2 block text-center text-xs font-bold text-ink underline underline-offset-2"
              >
                {t("VIEW BAG & CHECKOUT", "查看购物袋并结账")} →
              </Link>
            )}
            <p className="mt-2 text-[11px] leading-relaxed text-ink/40">
              {t(
                "Adds the 14534-H to your bag with your silver letter clip noted on the order.",
                "将标准款 14534-H 加入购物袋，并在订单中备注你的银色字母扣。"
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ---------- OTHER DIRECTIONS (smaller, below the main experience) ---------- */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {/* STRYDE LETTERS */}
        <Link href="/clips" className="group block overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="/products/14534-h/hero.jpg"
              alt="14534-H boot with STRYDE letter clips"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
              {STRYDE_LETTERS.map((ch) => (
                <span
                  key={ch}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-ink/20 bg-white/95 text-xs font-black text-ink shadow-sm"
                >
                  {ch}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-base font-black tracking-wide">{t("STRYDE LETTERS", "STRYDE 字母扣")}</h3>
            <p className="mt-1 text-sm text-ink/55">
              {t(
                "Signature preset exploration",
                "以 STRYDE 六个字母为造型的标志性字母扣，别在鞋前部环状装饰上。"
              )}
            </p>
          </div>
        </Link>

        {/* MONO DETAILS */}
        <Link href="/clips" className="group block overflow-hidden rounded-3xl border border-ink/10 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden">
            <img
              src="/products/14534-h/detail-01.jpg"
              alt="14534-H boot with minimal mono clip accents"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            {/* minimal black & silver geometric accents */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
              <span className="h-px w-8 bg-white/80" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/70 bg-ink/70 text-[10px] font-black text-white">
                M
              </span>
              <span className="h-2 w-2 rotate-45 border border-white/80 bg-white/20" />
              <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/50 bg-white/85 text-[10px] font-black text-ink">
                D
              </span>
              <span className="h-px w-8 bg-white/80" />
            </div>
          </div>
          <div className="p-5">
            <h3 className="text-base font-black tracking-wide">{t("MONO DETAILS", "极简黑银扣")}</h3>
            <p className="mt-1 text-sm text-ink/55">
              {t(
                "Minimal black-and-silver detail exploration",
                "黑银配色的极简字母扣，为个性化带来更低调的表达。"
              )}
            </p>
          </div>
        </Link>
      </div>

      {/* ---------- FULL EXPERIENCE ---------- */}
      <div className="mt-10 text-center">
        <Link href="/clips">
          <Button size="lg" variant="outline">
            {t("EXPLORE STRYDE CLIPS", "探索 STRYDE CLIPS")} <ArrowRight size={17} />
          </Button>
        </Link>
      </div>
    </section>
  );
}
