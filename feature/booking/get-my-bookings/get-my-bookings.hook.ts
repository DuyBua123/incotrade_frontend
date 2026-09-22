
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { api } from "@/lib/api/api";
import type {
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type { GetMyBookingsFilters, MyBooking } from "./get-my-bookings.type";

export const GET_MY_BOOKINGS_DEFAULT_PAGE = 1;
export const GET_MY_BOOKINGS_DEFAULT_SIZE = 7;

export const GET_MY_BOOKINGS_DEFAULT_FILTERS: GetMyBookingsFilters = {
  servedDate: "",
  status: "",
};

const GET_MY_BOOKINGS_ERROR_MESSAGE =
  "Không thể tải danh sách lịch hẹn của bạn. Vui lòng thử lại.";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_MY_BOOKINGS_ERROR_MESSAGE;
  }

  return GET_MY_BOOKINGS_ERROR_MESSAGE;
}

function buildParams(page: number, filters: GetMyBookingsFilters) {
  const params: Record<string, string> = {
    page: String(page),
    size: String(GET_MY_BOOKINGS_DEFAULT_SIZE),
  };

  if (filters.servedDate) {
    params.servedDate = filters.servedDate;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  return params;
}

export default function useGetMyBookings() {
  const [bookings, setBookings] = useState<MyBooking[]>([]);
  const [currentPage, setCurrentPage] = useState(GET_MY_BOOKINGS_DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(GET_MY_BOOKINGS_DEFAULT_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [activeFilters, setActiveFilters] = useState<GetMyBookingsFilters>(GET_MY_BOOKINGS_DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = useCallback(
    async (page: number, filters: GetMyBookingsFilters) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get<
          SuccessResponse<PageableResponse<MyBooking[]>>
        >("/bookings/get-my-bookings", {
          params: buildParams(page, filters),
        });

        const { items, pagination } = response.data.data;

        setBookings(items);
        setCurrentPage(pagination.currentPage);
        setPageSize(pagination.pageSize);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
        setHasNext(pagination.hasNext);
        setHasPrevious(pagination.hasPrevious);
      } catch (error) {
        setBookings([]);
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    async function loadInitialBookings() {
      try {
        const response = await api.get<
          SuccessResponse<PageableResponse<MyBooking[]>>
        >("/bookings/get-my-bookings", {
          params: buildParams(
            GET_MY_BOOKINGS_DEFAULT_PAGE,
            GET_MY_BOOKINGS_DEFAULT_FILTERS
          ),
        });

        const { items, pagination } = response.data.data;

        setBookings(items);
        setCurrentPage(pagination.currentPage);
        setPageSize(pagination.pageSize);
        setTotalItems(pagination.totalItems);
        setTotalPages(pagination.totalPages);
        setHasNext(pagination.hasNext);
        setHasPrevious(pagination.hasPrevious);
        setErrorMessage("");
      } catch (error) {
        setBookings([]);
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadInitialBookings();
  }, []);

  async function goToPage(page: number) {
    await loadBookings(page, activeFilters);
  }

  async function filter(nextFilters: GetMyBookingsFilters) {
    setActiveFilters(nextFilters);
    await loadBookings(GET_MY_BOOKINGS_DEFAULT_PAGE, nextFilters);
  }

  async function clearFilters() {
    setActiveFilters(GET_MY_BOOKINGS_DEFAULT_FILTERS);
    await loadBookings(
      GET_MY_BOOKINGS_DEFAULT_PAGE,
      GET_MY_BOOKINGS_DEFAULT_FILTERS
    );
  }

  function refresh() {
    void loadBookings(currentPage, activeFilters);
  }

  return {
    activeFilters,
    bookings,
    clearFilters,
    currentPage,
    errorMessage,
    filter,
    goToPage,
    hasNext,
    hasPrevious,
    isLoading,
    pageSize,
    refresh,
    totalItems,
    totalPages,
  };
}
