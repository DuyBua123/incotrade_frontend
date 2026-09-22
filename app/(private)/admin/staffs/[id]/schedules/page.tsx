import { requireAdmin } from "@/lib/security/auth.server";

import StaffSchedulesPageClient from "./StaffSchedulesPageClient";

export default async function StaffSchedulesPage({
  params,
}: PageProps<"/admin/staffs/[id]/schedules">) {
  await requireAdmin();

  const { id } = await params;

  return <StaffSchedulesPageClient staffId={id} />;
}
