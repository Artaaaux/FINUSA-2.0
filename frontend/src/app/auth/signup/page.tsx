import { SignupForm } from "./components/SignupForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun - FINUSA",
  description: "Daftar akun FINUSA baru untuk memulai pengelolaan finansial Anda.",
};

export default function SignupPage() {
  return <SignupForm />;
}
