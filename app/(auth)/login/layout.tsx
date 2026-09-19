import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Incodetrade - Đăng nhập"
};

export default function LoginLayout({ children }: LayoutProps<"/login">) {
  return children;
}
