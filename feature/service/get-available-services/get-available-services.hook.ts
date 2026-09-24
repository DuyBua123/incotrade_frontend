"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { clientApi } from "@/lib/api/api";
import type {
  Pageable,
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type {
  AvailableService,
  GetAvailableServicesRequest,
} from "./get-available-services.type";

export const GET_AVAILABLE_SERVICES_DEFAULT_PAGE = 1;
export const GET_AVAILABLE_SERVICES_DEFAULT_SIZE = 7;

const GET_AVAILABLE_SERVICES_ERROR_MESSAGE =
  "Không thể tải danh sách dịch vụ khả dụng. Vui lòng thử lại.";

const EMPTY_PAGINATION: Pageable = {
  currentPage: GET_AVAILABLE_SERVICES_DEFAULT_PAGE,
  pageSize: GET_AVAILABLE_SERVICES_DEFAULT_SIZE,
  totalItems: 0,
  totalPages: 1,
  hasNext: false,
  hasPrevious: false,
};

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_AVAILABLE_SERVICES_ERROR_MESSAGE;
  }

  return GET_AVAILABLE_SERVICES_ERROR_MESSAGE;
}

async function getAvailableServices({
  page = GET_AVAILABLE_SERVICES_DEFAULT_PAGE,
  size = GET_AVAILABLE_SERVICES_DEFAULT_SIZE,
  searchName,
}: GetAvailableServicesRequest) {
  const response = await clientApi.get<
    SuccessResponse<PageableResponse<AvailableService[]>>
  >("/services/get-available-services", {
    params: {
      page: String(page),
      size: String(size),
      searchName: searchName?.trim() || undefined,
    },
  });

  return response.data;
}

export default function useGetAvailableServices() {
  const [services, setServices] = useState<AvailableService[]>([]);
  const [pagination, setPagination] = useState<Pageable>(EMPTY_PAGINATION);
  const [currentPage, setCurrentPage] = useState(
    GET_AVAILABLE_SERVICES_DEFAULT_PAGE
  );
  const [searchName, setSearchName] = useState("");
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    async function loadServices() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getAvailableServices({
          page: currentPage,
          size: GET_AVAILABLE_SERVICES_DEFAULT_SIZE,
          searchName,
        });

        if (!isActive) {
          return;
        }

        setServices(response.data.items);
        setPagination(response.data.pagination);
      } catch (error) {
        if (!isActive) {
          return;
        }

        setServices([]);
        setPagination({
          ...EMPTY_PAGINATION,
          currentPage,
        });
        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadServices();

    return () => {
      isActive = false;
    };
  }, [currentPage, refreshIndex, searchName]);

  function goToPage(page: number) {
    setCurrentPage(page);
  }

  function search(nextSearchName: string) {
    setSearchName(nextSearchName.trim());
    setCurrentPage(GET_AVAILABLE_SERVICES_DEFAULT_PAGE);
  }

  function refresh() {
    setRefreshIndex((index) => index + 1);
  }

  return {
    currentPage: pagination.currentPage,
    errorMessage,
    goToPage,
    hasNext: pagination.hasNext,
    hasPrevious: pagination.hasPrevious,
    isLoading,
    pageSize: pagination.pageSize,
    refresh,
    search,
    searchName,
    services,
    totalItems: pagination.totalItems,
    totalPages: pagination.totalPages,
  };
}
