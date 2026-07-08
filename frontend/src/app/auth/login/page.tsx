import { LoginForm } from "./components/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk - FINUSA",
  description: "Masuk ke akun FINUSA Anda untuk mengelola finansial Anda.",
};

export default function LoginPage() {
  return <LoginForm />;
}
