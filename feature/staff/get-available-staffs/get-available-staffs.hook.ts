"use client";

import axios from "axios";
import { useState } from "react";

import { api } from "@/lib/api/api";
import type {
  Pageable,
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type {
  AvailableStaff,
  GetAvailableStaffsRequest,
} from "./get-available-staffs.type";

export const GET_AVAILABLE_STAFFS_DEFAULT_PAGE = 1;
export const GET_AVAILABLE_STAFFS_DEFAULT_SIZE = 7;

const GET_AVAILABLE_STAFFS_ERROR_MESSAGE =
  "Không thể tải danh sách nhân viên khả dụng. Vui lòng thử lại.";

const EMPTY_PAGINATION: Pageable = {
  currentPage: GET_AVAILABLE_STAFFS_DEFAULT_PAGE,
  pageSize: GET_AVAILABLE_STAFFS_DEFAULT_SIZE,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_AVAILABLE_STAFFS_ERROR_MESSAGE;
  }

  return GET_AVAILABLE_STAFFS_ERROR_MESSAGE;
}


export default function useGetAvailableStaffs() {
  const [staffs, setStaffs] = useState<AvailableStaff[]>([]);
  const [pagination, setPagination] = useState<Pageable>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");


  async function getAvailableStaffs({
    page = GET_AVAILABLE_STAFFS_DEFAULT_PAGE,
    size = GET_AVAILABLE_STAFFS_DEFAULT_SIZE,
    searchFullName,
  }: GetAvailableStaffsRequest) {

    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.get<SuccessResponse<PageableResponse<AvailableStaff[]>>>("/staffs/get-available-staffs", {
        params: {
          page: String(page),
          size: String(size),
          searchFullName: searchFullName?.trim() || null,
        },
      });

        setStaffs(response.data.data.items);
        setPagination(response.data.data.pagination);
      } catch (error) {
        setStaffs([]);
        setPagination({
          ...EMPTY_PAGINATION,
          currentPage: page,
        });
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
  }

  function reset() {
    setStaffs([]);
    setPagination(EMPTY_PAGINATION);
    setIsLoading(false);
    setErrorMessage("");
  }

  return {
    currentPage: pagination.currentPage,
    pageSize: pagination.pageSize,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    hasNext: pagination.hasNext,
    hasPrevious: pagination.hasPrevious,
    errorMessage,
    isLoading,
    staffs,
    getAvailableStaffs,
    reset,
  };
}
