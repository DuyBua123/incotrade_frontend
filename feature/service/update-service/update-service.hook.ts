import axios from "axios";
import { SubmitEvent, useEffect, useState } from "react";

import { api } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import { SuccessResponse } from "@/lib/api/success.response.";

import type { ServiceDetail } from "../get-service/get-service.type";
import type {
  UpdateServiceFieldErrors,
  UpdateServiceRequest,
  UpdateServiceResponse,
} from "./update-service.type";

type RawFieldErrors = Partial<Record<string, string>>;

const INITIAL_FORM: UpdateServiceRequest = {
  serviceId: "",
  serviceName: "",
  description: "",
  durationMinutes: "",
  price: "",
  isLock: "false",
};

const GET_SERVICE_ERROR_MESSAGE =
  "Không thể tải thông tin dịch vụ. Vui lòng thử lại.";
const UPDATE_SERVICE_ERROR_MESSAGE =
  "Không thể cập nhật dịch vụ lúc này. Vui lòng thử lại sau.";

function normalizeFieldErrors(errors: RawFieldErrors): UpdateServiceFieldErrors {
  return {
    serviceId: errors.serviceId ?? errors.ServiceId,
    serviceName: errors.serviceName ?? errors.ServiceName,
    description: errors.description ?? errors.Description,
    durationMinutes: errors.durationMinutes ?? errors.DurationMinutes,
    price: errors.price ?? errors.Price,
    isLock: errors.isLock ?? errors.IsLock,
  };
}

function buildFormFromService(service: ServiceDetail): UpdateServiceRequest {
  return {
    serviceId: String(service.id),
    serviceName: service.name,
    description: service.description ?? "",
    durationMinutes: String(service.durationMinutes),
    price: String(service.price),
    isLock: service.isLocked ? "true" : "false",
  };
}

function buildRequest(form: UpdateServiceRequest): UpdateServiceRequest {
  return {
    serviceId: form.serviceId,
    serviceName: form.serviceName,
    description: form.description?.trim() ? form.description : null,
    durationMinutes: form.durationMinutes,
    price: form.price,
    isLock: form.isLock?.trim() ? form.isLock : null,
  };
}

function getFailureMessage(error: unknown, fallbackMessage: string) {
  if (axios.isAxiosError<FailureResponse>(error)) {
    return error.response?.data?.message || fallbackMessage;
  }

  return fallbackMessage;
}

type UseUpdateServiceOptions = {
  isOpen: boolean;
  serviceId: string | null;
};


export default function useUpdateService({
  isOpen,
  serviceId,
}: UseUpdateServiceOptions) {
  const [form, setForm] = useState<UpdateServiceRequest>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<UpdateServiceFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [detailError, setDetailError] = useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || !serviceId) {
      return;
    }

    const activeServiceId = serviceId;

    async function loadServiceDetail() {
      setIsLoadingDetail(true);
      setDetailError("");
      setFormError("");
      setFieldErrors({});

      try {
        const { data } = await api.get<SuccessResponse<ServiceDetail>>(
          "/services/get-service",
          {
            params: {
              serviceId: activeServiceId,
            },
          }
        );

        setForm(buildFormFromService(data.data));
      } catch (error) {

        setForm((current) => ({
          ...current,
          serviceId: activeServiceId,
        }));
        setDetailError(getFailureMessage(error, GET_SERVICE_ERROR_MESSAGE));
      } finally {
        setIsLoadingDetail(false);
      }
    }

    void loadServiceDetail();


  }, [isOpen, serviceId]);

  function updateField(field: keyof UpdateServiceRequest, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));

    if (formError) {
      setFormError("");
    }
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setFieldErrors({});
    setFormError("");
    setDetailError("");
  }

  function handleUpdateError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError(UPDATE_SERVICE_ERROR_MESSAGE);
      return;
    }

    const failure = error.response.data;

    if (failure.code === ERROR_CODES.INPUT_VALIDATION_ERROR) {
      setFieldErrors(normalizeFieldErrors(failure.errors as RawFieldErrors));
      setFormError(failure.message);
      return;
    }

    setFormError(failure.message || UPDATE_SERVICE_ERROR_MESSAGE);
  }

  async function submitUpdateService(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await api.put<SuccessResponse<UpdateServiceResponse>>(
        "/services/update-service",
        buildRequest(form)
      );

      resetForm();

      return data.message;
    } catch (error) {
      handleUpdateError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    detailError,
    fieldErrors,
    form,
    formError,
    isLoadingDetail,
    isSubmitting,
    resetForm,
    submitUpdateService,
    updateField,
  };
}
