import Image from "next/image";
import Link from "next/link";

import PublicNavbarActions from "./_components/PublicNavbarActions";
import { getMeServer } from "@/lib/security/auth.server";

export default async function Home() {
  const currentUser = await getMeServer();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f9ff_0%,#ffffff_42%,#f7f9ff_100%)] text-on-surface">
      <nav className="sticky top-0 z-50 border-b border-outline-variant/20 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-3 items-center px-4 py-4 sm:px-6 lg:px-10">
          <Link
            href="/"
            className="text-lg font-extrabold text-primary transition hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
          >
            Incodetrade
          </Link>

          <div className="flex justify-center">
            <a
              href="#"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-on-surface-variant transition hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Dịch vụ
            </a>
          </div>

          <div className="flex justify-end">
            <PublicNavbarActions initialUser={currentUser?.user ? currentUser.user : null} />
          </div>
        </div>
      </nav>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-24">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-extrabold leading-tight text-on-surface sm:text-5xl lg:text-6xl">
            Tìm dịch vụ phù hợp và đặt lịch vào mọi lúc và mọi nơi.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-on-surface-variant sm:text-lg">
            Incodetrade giúp bạn xem thông tin dịch vụ, chọn thời gian còn trống và gửi yêu cầu đặt lịch trong một lần. Không cần nhắn qua lại quá nhiều, cũng không phải ghi nhớ từng chi tiết nhỏ.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Xem dịch vụ
            </a>
            <a
              href="#why-booking"
              className="inline-flex items-center justify-center rounded-xl border border-outline-variant/40 bg-white px-5 py-3 text-sm font-bold text-primary transition hover:border-primary/30 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              Cách hoạt động
            </a>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-outline-variant/20 bg-white shadow-[0_14px_34px_rgba(6,22,86,0.14)]">
          <Image
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80"
            alt="Service professional preparing appointment details with a customer"
            width={1200}
            height={900}
            priority
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="h-full min-h-[420px] w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-5 sm:p-6">
            <div className="max-w-sm rounded-xl border border-white/15 bg-white/92 p-4 shadow-sm backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Tư vấn</p>
              <p className="mt-2 text-lg font-extrabold text-on-surface">Luôn sẵn sàng 24 giờ</p>
              <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                Từ tư vấn nhanh đến hỗ trợ tại chỗ, lịch trống được trình bày rõ để bạn dễ chọn.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="why-booking" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-10">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              label: "Dịch vụ",
              title: "Biết trước mình chọn gì",
              text: "Mỗi dịch vụ có thông tin cơ bản, thời lượng dự kiến và lịch còn trống trước khi bạn đặt.",
            },
            {
              label: "Lịch hẹn",
              title: "Chọn giờ không phải đoán",
              text: "Bạn xem các khung giờ phù hợp rồi giữ chỗ, thay vì phải gọi điện hỏi từng lượt.",
            },
            {
              label: "Theo dõi",
              title: "Thông tin nằm đúng chỗ",
              text: "Chi tiết đặt lịch, cập nhật và bước tiếp theo được gom lại để bạn mở ra là thấy ngay.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border border-outline-variant/20 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">{item.label}</p>
              <h2 className="mt-3 text-xl font-extrabold text-on-surface">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-on-surface-variant">{item.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
