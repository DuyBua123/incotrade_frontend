import { getMeServer } from "@/lib/security/auth.server";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Incodetrade - Đăng nhập"
};

export default async function LoginLayout({ children }: LayoutProps<"/login">) {
  const currentUser = await getMeServer();

  if (currentUser) {
    redirect("/admin");
  }
  
  return children;
}
