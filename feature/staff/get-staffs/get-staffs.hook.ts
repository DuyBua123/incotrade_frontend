"use client";

import axios from "axios";
import { useEffect, useState } from "react";

import { clientApi } from "@/lib/api/api";
import type {
  PageableResponse,
  SuccessResponse,
} from "@/lib/api/success.response.";

import type { Staff } from "./get-staffs.type";

export const GET_STAFFS_DEFAULT_PAGE = 1;
export const GET_STAFFS_DEFAULT_SIZE = 7;

const GET_STAFFS_ERROR_MESSAGE =
  "Không thể tải danh sách nhân viên. Vui lòng thử lại.";

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || GET_STAFFS_ERROR_MESSAGE;
  }

  return GET_STAFFS_ERROR_MESSAGE;
}



export default function useGetStaffs(searchValue: string) {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(GET_STAFFS_DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(GET_STAFFS_DEFAULT_SIZE);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");


  useEffect(() => {
    async function loadInitialStaffs() {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await clientApi.get<SuccessResponse<PageableResponse<Staff[]>>>(
          "/staffs/get-staffs",
          {
            params: {
              page: String(GET_STAFFS_DEFAULT_PAGE),
              size: String(GET_STAFFS_DEFAULT_SIZE),
            },
          }
        );
      
        setStaffs(response.data.data.items);
        setCurrentPage(response.data.data.pagination.currentPage);
        setPageSize(response.data.data.pagination.pageSize);
        setTotalItems(response.data.data.pagination.totalItems);
        setTotalPages(response.data.data.pagination.totalPages);
        setHasNext(response.data.data.pagination.hasNext);
        setHasPrevious(response.data.data.pagination.hasPrevious);
      } catch (error) {
          setStaffs([]);
          setErrorMessage(getErrorMessage(error));
      } finally {
          setIsLoading(false);
      }
    }

    void loadInitialStaffs();
  }, []);

  async function goToPage(page: number) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await clientApi.get<SuccessResponse<PageableResponse<Staff[]>>>(
        "/staffs/get-staffs",
        {
          params: {
            page: String(page),
            size: String(GET_STAFFS_DEFAULT_SIZE),
            searchFullName: searchValue ? searchValue : ""
          },
        }
      );
    
      setStaffs(response.data.data.items);
      setCurrentPage(response.data.data.pagination.currentPage);
      setPageSize(response.data.data.pagination.pageSize);
      setTotalItems(response.data.data.pagination.totalItems);
      setTotalPages(response.data.data.pagination.totalPages);
      setHasNext(response.data.data.pagination.hasNext);
      setHasPrevious(response.data.data.pagination.hasPrevious);
    } catch (error) {
        setStaffs([]);
        setErrorMessage(getErrorMessage(error));
    } finally {
        setIsLoading(false);
    }
  }

  async function search(searchFullName: string) {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await clientApi.get<SuccessResponse<PageableResponse<Staff[]>>>(
        "/staffs/get-staffs",
        {
          params: {
            page: String(GET_STAFFS_DEFAULT_PAGE),
            size: String(GET_STAFFS_DEFAULT_SIZE),
            searchFullName: searchFullName
          },
        }
      );
    
      setStaffs(response.data.data.items);
      setCurrentPage(response.data.data.pagination.currentPage);
      setPageSize(response.data.data.pagination.pageSize);
      setTotalItems(response.data.data.pagination.totalItems);
      setTotalPages(response.data.data.pagination.totalPages);
      setHasNext(response.data.data.pagination.hasNext);
      setHasPrevious(response.data.data.pagination.hasPrevious);
    } catch (error) {
        setStaffs([]);
        setErrorMessage(getErrorMessage(error));
    } finally {
        setIsLoading(false);
    }
  }

  async function refresh() {    
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await clientApi.get<SuccessResponse<PageableResponse<Staff[]>>>(
        "/staffs/get-staffs",
        {
          params: {
            page: String(currentPage),
            size: String(GET_STAFFS_DEFAULT_SIZE)
          },
        }
      );
    
      setStaffs(response.data.data.items);
      setCurrentPage(response.data.data.pagination.currentPage);
      setPageSize(response.data.data.pagination.pageSize);
      setTotalItems(response.data.data.pagination.totalItems);
      setTotalPages(response.data.data.pagination.totalPages);
      setHasNext(response.data.data.pagination.hasNext);
      setHasPrevious(response.data.data.pagination.hasPrevious);
    } catch (error) {
        setStaffs([]);
        setErrorMessage(getErrorMessage(error));
    } finally {
        setIsLoading(false);
    }
  }

  return {
    currentPage,
    errorMessage,
    hasNext,
    hasPrevious,
    isLoading,
    pageSize,
    staffs,
    totalItems,
    totalPages,
    goToPage,
    refresh,
    search,
  };
}
