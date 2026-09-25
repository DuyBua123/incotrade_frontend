"use client";

import { useEffect, useRef, useState } from "react";
import {
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { BellRing, CheckCircle2, X } from "lucide-react";

import {
  BOOKING_STATUS_NOTIFICATION_EVENT,
  RECEIVE_UPDATING_BOOKING_STATUS_MESSAGE,
  UPDATE_BOOKING_STATUS_NOTIFICATION_HUB_URL,
} from "@/lib/realtime/booking-status-notifications";
import { useAuthStore } from "@/lib/security/auth.store";

type BookingStatusToast = {
  id: number;
  message: string;
};

const TOAST_DURATION_MS = 7000;

export default function CustomerBookingStatusNotifications() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [toasts, setToasts] = useState<BookingStatusToast[]>([]);
  const toastIdRef = useRef(0);

  useEffect(() => {

    console.log(accessToken);
    
    if (!accessToken) {
      return;
    }

    function removeToast(id: number) {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      );
    }

    function handleNotification(content: string) {
      const id = toastIdRef.current + 1;
      toastIdRef.current = id;

      setToasts((currentToasts) => [
        { id, message: content },
        ...currentToasts.slice(0, 2),
      ]);

      window.dispatchEvent(
        new CustomEvent(BOOKING_STATUS_NOTIFICATION_EVENT, {
          detail: content,
        })
      );

      window.setTimeout(() => removeToast(id), TOAST_DURATION_MS);
    }

    async function startConnection() {
      try {
        if (connection.state === HubConnectionState.Disconnected) {
          await connection.start();
        }
      } catch (error) {
        console.error("Unable to start booking status notification hub.", error);
      }
    }


    const connection = new HubConnectionBuilder()
      .withUrl(UPDATE_BOOKING_STATUS_NOTIFICATION_HUB_URL, {
        accessTokenFactory: () => accessToken,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();


    connection.on(
      RECEIVE_UPDATING_BOOKING_STATUS_MESSAGE,
      handleNotification
    );

    void startConnection();

    return () => {
      connection.off(
        RECEIVE_UPDATING_BOOKING_STATUS_MESSAGE,
        handleNotification
      );

      if (connection.state !== HubConnectionState.Disconnected) {
        void connection.stop();
      }
    };
  }, [accessToken]);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed right-4 top-4 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col gap-3 sm:right-6 sm:top-6"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="rounded-2xl border border-primary/10 bg-white/95 p-4 text-on-surface shadow-[0_14px_34px_rgba(6,22,86,0.18)] backdrop-blur animate-in fade-in slide-in-from-top-2 duration-200"
          role="status"
        >
          <div className="flex items-start gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <BellRing className="size-5" strokeWidth={2.4} />
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.14em] text-primary">
                <CheckCircle2 className="size-3.5" aria-hidden="true" />
                Booking updated
              </div>

              <p className="mt-1.5 break-words text-sm font-semibold leading-6 text-on-surface-variant">
                {toast.message}
              </p>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition hover:bg-slate-100 hover:text-on-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label="Close booking status notification"
              onClick={() =>
                setToasts((currentToasts) =>
                  currentToasts.filter(
                    (currentToast) => currentToast.id !== toast.id
                  )
                )
              }
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
