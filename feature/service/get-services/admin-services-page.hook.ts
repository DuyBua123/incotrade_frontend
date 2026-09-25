"use client";

import { useState } from "react";

import useSetServiceLocking from "@/feature/service/set-service-locking/set-service-locking.hook";

import useGetServices from "./get-services.hook";
import type { Service } from "./get-services.type";

export default function useAdminServicesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null
  );
  const [successMessage, setSuccessMessage] = useState("");
  const getServicesState = useGetServices();
  const {
    errorMessage: lockErrorMessage,
    isSubmitting: isSettingServiceLock,
    resetError: resetLockError,
    setServiceLocking,
    submittingServiceId,
  } = useSetServiceLocking();

  function handleCreateServiceCreated(message: string) {
    setSuccessMessage(message);
    resetLockError();
    getServicesState.refresh();
    setIsCreateModalOpen(false);
  }

  function handleOpenCreateModal() {
    setSuccessMessage("");
    resetLockError();
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    setIsCreateModalOpen(false);
  }

  function handleOpenUpdateModal(serviceId: string | number) {
    setSuccessMessage("");
    resetLockError();
    setSelectedServiceId(String(serviceId));
    setIsUpdateModalOpen(true);
  }

  function handleUpdateServiceUpdated(message: string) {
    setSuccessMessage(message);
    resetLockError();
    getServicesState.refresh();
    setIsUpdateModalOpen(false);
    setSelectedServiceId(null);
  }

  function handleCloseUpdateModal() {
    setIsUpdateModalOpen(false);
    setSelectedServiceId(null);
  }

  function handleRefresh() {
    setSuccessMessage("");
    resetLockError();
    getServicesState.refresh();
  }

  async function handleSetServiceLocking(service: Service) {
    const nextIsLocked = !service.isLocked;

    setSuccessMessage("");

    const message = await setServiceLocking({
      serviceId: String(service.id),
      isLocked: nextIsLocked ? "true" : "false",
    });

    if (!message) {
      return;
    }

    setSuccessMessage(message);
    getServicesState.refresh();
  }

  return {
    ...getServicesState,
    isCreateModalOpen,
    isSettingServiceLock,
    isUpdateModalOpen,
    lockErrorMessage,
    selectedServiceId,
    submittingServiceId,
    successMessage,
    handleCloseCreateModal,
    handleCloseUpdateModal,
    handleCreateServiceCreated,
    handleOpenCreateModal,
    handleOpenUpdateModal,
    handleRefresh,
    handleSetServiceLocking,
    handleUpdateServiceUpdated,
  };
}
