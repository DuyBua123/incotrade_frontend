import axios from "axios";
import { useEffect, useState } from "react";

import { api } from "@/lib/api/api";

import type { GetServicesResponse, Service } from "./get-services.type";
import { setupInterceptors } from "@/lib/api/interceptor";

export const GET_SERVICES_DEFAULT_PAGE = 1;
export const GET_SERVICES_DEFAULT_SIZE = 7;

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Không thể tải danh sách dịch vụ. Vui lòng thử lại."
    );
  }

  return "Không thể tải danh sách dịch vụ. Vui lòng thử lại.";
}

async function getServices(page: number) {
  const response = await api.get<GetServicesResponse>(
    "/services/get-services",
    {
      params: {
        page,
        size: GET_SERVICES_DEFAULT_SIZE,
      },
    }
  );

  return response.data;
}

export default function useGetServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [currentPage, setCurrentPage] = useState(GET_SERVICES_DEFAULT_PAGE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  function applyServicesPayload(payload: GetServicesResponse) {
    const pagination = payload.pagination;

    setServices(payload.items);
    setCurrentPage(pagination.currentPage);
    setTotalItems(pagination.totalItems);
    setTotalPages(pagination.totalPages);
    setHasNext(pagination.hasNext);
    setHasPrevious(pagination.hasPrevious);
  }

  useEffect(() => {

    async function loadInitialServices() {
      try {

        const response = await getServices(GET_SERVICES_DEFAULT_PAGE);

        applyServicesPayload(response);
        setErrorMessage("");
      } catch (error) {

        setServices([]);
        setErrorMessage(getErrorMessage(error));
      }
    }

    loadInitialServices();

  }, []);

  async function goToPage(page: number) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = await getServices(page);

      applyServicesPayload(payload);
    } catch (error) {
      setServices([]);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  function refresh() {
    void goToPage(currentPage);
  }

  return {
    currentPage,
    errorMessage,
    goToPage,
    hasNext,
    hasPrevious,
    isLoading,
    refresh,
    services,
    totalItems,
    totalPages,
  };
}
