import type { Metadata } from "next";
// import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Tải font về local
// const beVietnamPro = Be_Vietnam_Pro({
//   subsets: ["latin", "vietnamese"],
//   weight: ["300", "400", "500", "600", "700", "800", "900"],
// });

export const metadata: Metadata = {
  title: "Incodetrade - Nền tảng thuê dịch vụ",
  description: "Tìm kiếm và thuê dịch vụ với Incodetrade.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
