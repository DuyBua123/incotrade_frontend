"use client";

import { useParams } from "next/navigation";
import { useState } from "react";

import useGetStaffSchedules from "./get-staff-schedules.hook";

export default function useStaffSchedulesPage() {
  const { id } = useParams<{ id: string }>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const getSchedulesState = useGetStaffSchedules(id);

  function handleCreateScheduleCreated(message: string) {
    setSuccessMessage(message);
    getSchedulesState.refresh();
    setIsCreateModalOpen(false);
  }

  function handleOpenCreateModal() {
    setSuccessMessage("");
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    setIsCreateModalOpen(false);
  }

  function handleRefresh() {
    setSuccessMessage("");
    getSchedulesState.refresh();
  }

  return {
    ...getSchedulesState,
    id,
    isCreateModalOpen,
    successMessage,
    handleCloseCreateModal,
    handleCreateScheduleCreated,
    handleOpenCreateModal,
    handleRefresh,
  };
}
