import axios from "axios";
import { useState } from "react";

import { api } from "@/lib/api/api";
import type { FailureResponse } from "@/lib/api/failure.response.";
import type { SuccessResponse } from "@/lib/api/success.response.";

import type {
  SetServiceLockingRequest,
  SetServiceLockingResponse,
} from "./set-service-locking.type";

const SET_SERVICE_LOCKING_ERROR_MESSAGE =
  "Không thể cập nhật trạng thái khóa dịch vụ lúc này. Vui lòng thử lại sau.";

function getFailureMessage(error: unknown) {
  if (axios.isAxiosError<FailureResponse>(error)) {
    return error.response?.data?.message || SET_SERVICE_LOCKING_ERROR_MESSAGE;
  }

  return SET_SERVICE_LOCKING_ERROR_MESSAGE;
}

export default function useSetServiceLocking() {
  const [errorMessage, setErrorMessage] = useState("");
  const [submittingServiceId, setSubmittingServiceId] = useState<string | null>(
    null
  );

  async function setServiceLocking(request: SetServiceLockingRequest) {
    setSubmittingServiceId(request.serviceId);
    setErrorMessage("");
    
    try {
      const { data } = await api.patch<
        SuccessResponse<SetServiceLockingResponse>
      >("/services/set-service-locking", request);

      return data.message;
    } catch (error) {
      setErrorMessage(getFailureMessage(error));
    } finally {
      setSubmittingServiceId(null);
    }
  }

  function resetError() {
    setErrorMessage("");
  }

  return {
    errorMessage,
    isSubmitting: submittingServiceId !== null,
    resetError,
    setServiceLocking,
    submittingServiceId,
  };
}
