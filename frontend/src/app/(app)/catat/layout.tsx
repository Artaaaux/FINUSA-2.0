import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Catat - FINUSA",
  description: "Pencatatan arus uang masuk dan keluar usaha secara cepat dan praktis.",
};

export default function CatatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
