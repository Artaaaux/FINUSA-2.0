import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password - FINUSA",
  description: "Reset password akun FINUSA Anda melalui email.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
