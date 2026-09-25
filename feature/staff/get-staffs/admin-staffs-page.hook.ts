"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import useGetStaffs from "./get-staffs.hook";
import type { Staff } from "./get-staffs.type";

export default function useAdminStaffsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const getStaffsState = useGetStaffs(searchValue);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    await getStaffsState.search(searchValue);
  }

  async function handleClearSearch() {
    setSearchValue("");
    setSuccessMessage("");
    await getStaffsState.search("");
  }

  function handleCreateStaffCreated(message: string) {
    setSuccessMessage(message);
    getStaffsState.refresh();
    setIsCreateModalOpen(false);
  }

  function handleOpenCreateModal() {
    setSuccessMessage("");
    setIsCreateModalOpen(true);
  }

  function handleCloseCreateModal() {
    setIsCreateModalOpen(false);
  }

  function handleOpenUpdateModal(staff: Staff) {
    setSuccessMessage("");
    setSelectedStaff(staff);
    setIsUpdateModalOpen(true);
  }

  function handleUpdateStaffUpdated(message: string) {
    setSuccessMessage(message);
    getStaffsState.refresh();
    setIsUpdateModalOpen(false);
    setSelectedStaff(null);
  }

  function handleCloseUpdateModal() {
    setIsUpdateModalOpen(false);
    setSelectedStaff(null);
  }

  function handleRefresh() {
    setSuccessMessage("");
    getStaffsState.refresh();
  }

  return {
    ...getStaffsState,
    isCreateModalOpen,
    isUpdateModalOpen,
    searchValue,
    selectedStaff,
    successMessage,
    setSearchValue,
    handleClearSearch,
    handleCloseCreateModal,
    handleCloseUpdateModal,
    handleCreateStaffCreated,
    handleOpenCreateModal,
    handleOpenUpdateModal,
    handleRefresh,
    handleSearch,
    handleUpdateStaffUpdated,
  };
}
