import * as Yup from "yup";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions, LabelStatus } from "@/constants/backend.enums";
import { isNotEmpty, oneOfOptions } from "@/components/global/utils/yup.util";

/**
 * Validation schema for client and contract-related data.
 */
export const LabelValidationSchema = Yup.object({
  labelId: Yup.string().nullable(),
  clientId: Yup.mixed().nullable().test("is-not-empty", "Client is required", isNotEmpty).required(),
  labelName: Yup.string().required("Label Name is required"),
  labelStatus: oneOfOptions(LabelStatus, "Invalid type"),
});
