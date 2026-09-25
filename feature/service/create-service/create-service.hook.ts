import axios from "axios";
import { SubmitEvent, useState } from "react";

import { clientApi } from "@/lib/api/api";
import {
  ERROR_CODES,
  type FailureResponse,
} from "@/lib/api/failure.response.";
import { SuccessResponse } from "@/lib/api/success.response.";

import type {
  CreateServiceFieldErrors,
  CreateServiceRequest,
  CreateServiceResponse,
} from "./create-service.type";

type RawFieldErrors = Partial<Record<string, string>>;

const INITIAL_FORM: CreateServiceRequest = {
  serviceName: "",
  description: "",
  durationMinutes: "",
  price: "",
  isLock: "false",
};

const CREATE_SERVICE_ERROR_MESSAGE = 
  "Không thể tạo dịch vụ lúc này. Vui lòng thử lại sau.";

function normalizeFieldErrors(errors: RawFieldErrors): CreateServiceFieldErrors {
  return {
    serviceName: errors.serviceName ?? errors.ServiceName,
    description: errors.description ?? errors.Description,
    durationMinutes: errors.durationMinutes ?? errors.DurationMinutes,
    price: errors.price ?? errors.Price,
    isLock: errors.isLock ?? errors.IsLock,
  };
}

function buildRequest(form: CreateServiceRequest): CreateServiceRequest {
  return {
    serviceName: form.serviceName,
    description: form.description?.trim() ? form.description : null,
    durationMinutes: form.durationMinutes,
    price: form.price,
    isLock: form.isLock?.trim() ? form.isLock : null,
  };
}


export default function useCreateService() {
  const [form, setForm] = useState<CreateServiceRequest>(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState<CreateServiceFieldErrors>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: keyof CreateServiceRequest, value: string) {
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
  }

  function handleCreateError(error: unknown) {
    if (!axios.isAxiosError<FailureResponse>(error) || !error.response) {
      setFormError(CREATE_SERVICE_ERROR_MESSAGE);
      return;
    }

    const failure = error.response.data;

    if (failure.code === ERROR_CODES.INPUT_VALIDATION_ERROR) {
      setFieldErrors(normalizeFieldErrors(failure.errors as RawFieldErrors));
      setFormError(failure.message);
      return;
    }

    setFormError(
      failure.message || CREATE_SERVICE_ERROR_MESSAGE
    );
  }

  async function submitCreateService(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setFieldErrors({});
    setFormError("");

    try {
      const { data } = await clientApi.post<SuccessResponse<CreateServiceResponse>>(
        "/services/create-service",
        buildRequest(form)
      );

      resetForm();
      
      return data.message;
      // onCreated?.(data.message);
    } catch (error) {
      handleCreateError(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    fieldErrors,
    form,
    formError,
    isSubmitting,
    submitCreateService,
    resetForm,
    updateField,
  };
}
