import { CalendarPlus, Clock3, Sparkles, WalletCards } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { AvailableService } from "@/feature/service/get-available-services/get-available-services.type";

function formatDuration(minutes: number) {
  return `${minutes.toLocaleString("vi-VN")} phút`;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

type ServiceCardProps = {
  onBook: (service: AvailableService) => void;
  service: AvailableService;
};

export function ServiceCard({ onBook, service }: ServiceCardProps) {
  return (
    <Card className="h-full gap-0 border border-outline-variant/20 bg-white py-0 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="border-b border-outline-variant/15 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Badge
              variant="outline"
              className="h-auto border-service-cyan/20 bg-service-cyan/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-service-cyan"
            >
              <Sparkles className="size-3" aria-hidden="true" />
              Khả dụng
            </Badge>
            <CardTitle className="mt-4 break-words text-xl font-extrabold text-on-surface">
              {service.serviceName}
            </CardTitle>
          </div>
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarPlus className="size-5" aria-hidden="true" />
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col p-5">
        <p className="min-h-[72px] break-words text-sm leading-6 text-on-surface-variant">
          {service.description || "Dịch vụ đang được cập nhật mô tả chi tiết."}
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-outline-variant/20 bg-surface-soft p-3">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-primary-teal">
              <Clock3 className="size-4" aria-hidden="true" />
              Thời lượng
            </div>
            <p className="mt-2 text-base font-extrabold text-on-surface">
              {formatDuration(service.durationMinutes)}
            </p>
          </div>

          <div className="rounded-xl border border-outline-variant/20 bg-surface-soft p-3">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-primary-indigo">
              <WalletCards className="size-4" aria-hidden="true" />
              Chi phí
            </div>
            <p className="mt-2 text-base font-extrabold text-on-surface">
              {formatCurrency(service.price)}
            </p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-outline-variant/15 bg-white p-5">
        <Button
          type="button"
          size="lg"
          onClick={() => onBook(service)}
          className="h-11 w-full gap-2 font-bold"
        >
          <CalendarPlus data-icon="inline-start" />
          Đặt lịch
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ServiceCardSkeleton() {
  return (
    <Card className="gap-0 border border-outline-variant/20 bg-white py-0 shadow-sm">
      <CardHeader className="border-b border-outline-variant/15 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="mt-4 h-7 w-4/5" />
          </div>
          <Skeleton className="size-11 rounded-xl" />
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-3 h-4 w-5/6" />
        <Skeleton className="mt-3 h-4 w-2/3" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
      </CardContent>
      <CardFooter className="border-t border-outline-variant/15 bg-white p-5">
        <Skeleton className="h-11 w-full rounded-lg" />
      </CardFooter>
    </Card>
  );
}
