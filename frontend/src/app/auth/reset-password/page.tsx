import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Atur Ulang Password - FINUSA",
  description: "Buat kata sandi baru untuk akun FINUSA Anda.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
