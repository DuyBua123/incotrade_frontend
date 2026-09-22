"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { api } from "@/lib/api/api";
import type {
  Pageable,
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type { GetStaffScheduleResponse } from "./get-staff-schedules.type";

export const GET_STAFF_SCHEDULES_DEFAULT_PAGE = 1;
export const GET_STAFF_SCHEDULES_DEFAULT_SIZE = 7;

const GET_STAFF_SCHEDULES_ERROR_MESSAGE =
  "Không thể tải lịch làm việc của nhân viên. Vui lòng thử lại.";

const EMPTY_PAGINATION: Pageable = {
  currentPage: GET_STAFF_SCHEDULES_DEFAULT_PAGE,
  pageSize: GET_STAFF_SCHEDULES_DEFAULT_SIZE,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_STAFF_SCHEDULES_ERROR_MESSAGE;
  }

  return GET_STAFF_SCHEDULES_ERROR_MESSAGE;
}

async function getStaffSchedules(staffId: string, page: number) {
  const response = await api.get<
    SuccessResponse<PageableResponse<GetStaffScheduleResponse[]>>
  >("/staffs/get-staff-schedules", {
    params: {
      staffId: String(staffId),
      page: String(page),
      size: String(GET_STAFF_SCHEDULES_DEFAULT_SIZE),
    },
  });

  return response.data;
}

export default function useGetStaffSchedules(staffId: string) {
  const [schedules, setSchedules] = useState<GetStaffScheduleResponse[]>([]);
  const [pagination, setPagination] = useState<Pageable>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadInitialSchedules() {
      try {
        const response = await getStaffSchedules(
          staffId,
          GET_STAFF_SCHEDULES_DEFAULT_PAGE
        );

        setSchedules(response.data.items);
        setPagination(response.data.pagination);
        setErrorMessage("");
      } catch (error) {
        setSchedules([]);
        setPagination(EMPTY_PAGINATION);
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadInitialSchedules();
  }, [staffId]);

  async function goToPage(page: number) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getStaffSchedules(staffId, page);

      setSchedules(response.data.items);
      setPagination(response.data.pagination);
    } catch (error) {
      setSchedules([]);
      setPagination({
        ...EMPTY_PAGINATION,
        currentPage: page,
      });
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function refresh() {
    void goToPage(pagination.currentPage);
  }

  return {
    currentPage: pagination.currentPage,
    errorMessage,
    hasNext: pagination.hasNext,
    hasPrevious: pagination.hasPrevious,
    isLoading,
    pageSize: pagination.pageSize,
    schedules,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
    goToPage,
    refresh,
  };
}
