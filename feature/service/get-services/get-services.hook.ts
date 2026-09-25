import axios from "axios";
import { useEffect, useState } from "react";

import { clientApi } from "@/lib/api/api";
import type {
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type { Service } from "./get-services.type";

export const GET_SERVICES_DEFAULT_PAGE = 1;
export const GET_SERVICES_DEFAULT_SIZE = 7;

const GET_SERVICES_ERROR_MESSAGE =
  "Không thể tải danh sách dịch vụ. Vui lòng thử lại.";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_SERVICES_ERROR_MESSAGE;
  }

  return GET_SERVICES_ERROR_MESSAGE;
}

async function getServices(page: number) {
  const response = await clientApi.get<SuccessResponse<PageableResponse<Service[]>>>(
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

  useEffect(() => {
    async function loadInitialServices() {
      try {
        const response = await getServices(GET_SERVICES_DEFAULT_PAGE);

        setServices(response.data.items);
        setCurrentPage(response.data.pagination.currentPage);
        setTotalItems(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
        setHasNext(response.data.pagination.hasNext);
        setHasPrevious(response.data.pagination.hasPrevious);
        setErrorMessage("");
      } catch (error) {
        setServices([]);
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadInitialServices();
  }, []);

  async function goToPage(page: number) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getServices(page);

      setServices(response.data.items);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalItems(response.data.pagination.totalItems);
      setTotalPages(response.data.pagination.totalPages);
      setHasNext(response.data.pagination.hasNext);
      setHasPrevious(response.data.pagination.hasPrevious);
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
