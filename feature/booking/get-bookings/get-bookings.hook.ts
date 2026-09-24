import axios from "axios";
import { useCallback, useEffect, useState } from "react";

import { api } from "@/lib/api/api";
import type {
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type { Booking, GetBookingsFilters } from "./get-bookings.type";

export const GET_BOOKINGS_DEFAULT_PAGE = 1;
export const GET_BOOKINGS_DEFAULT_SIZE = 7;

export const GET_BOOKINGS_DEFAULT_FILTERS: GetBookingsFilters = {
  servedDate: "",
  status: "",
};

const GET_BOOKINGS_ERROR_MESSAGE =
  "Không thể tải danh sách lịch hẹn. Vui lòng thử lại.";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_BOOKINGS_ERROR_MESSAGE;
  }

  return GET_BOOKINGS_ERROR_MESSAGE;
}

function buildParams(page: number, filters: GetBookingsFilters) {
  const params: Record<string, string> = {
    page: String(page),
    size: String(GET_BOOKINGS_DEFAULT_SIZE),
  };

  if (filters.servedDate) {
    params.servedDate = filters.servedDate;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  return params;
}

export default function useGetBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentPage, setCurrentPage] = useState(GET_BOOKINGS_DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(GET_BOOKINGS_DEFAULT_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [activeFilters, setActiveFilters] = useState<GetBookingsFilters>(GET_BOOKINGS_DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadBookings = useCallback(
    async (page: number, filters: GetBookingsFilters) => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await api.get<
          SuccessResponse<PageableResponse<Booking[]>>
        >("/bookings/get-bookings", {
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
          SuccessResponse<PageableResponse<Booking[]>>
        >("/bookings/get-bookings", {
          params: buildParams(
            GET_BOOKINGS_DEFAULT_PAGE,
            GET_BOOKINGS_DEFAULT_FILTERS
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

  async function filter(nextFilters: GetBookingsFilters) {
    setActiveFilters(nextFilters);
    await loadBookings(GET_BOOKINGS_DEFAULT_PAGE, nextFilters);
  }

  async function clearFilters() {
    setActiveFilters(GET_BOOKINGS_DEFAULT_FILTERS);
    await loadBookings(GET_BOOKINGS_DEFAULT_PAGE, GET_BOOKINGS_DEFAULT_FILTERS);
  }

  function refresh() {
    void loadBookings(currentPage, activeFilters);
  }

  return {
    activeFilters,
    bookings,
    currentPage,
    errorMessage,
    hasNext,
    hasPrevious,
    isLoading,
    pageSize,
    totalItems,
    totalPages,
    clearFilters,
    filter,
    goToPage,
    refresh,
  };
}
