import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proof Mode",
  robots: { index: false, follow: false },
};

export default function ProofLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
