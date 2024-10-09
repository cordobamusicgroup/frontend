import * as Yup from "yup";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions, LabelStatus } from "@/constants/backend.enums";
import { isAfterField, isFutureDate, isValidDayjs, oneOfOptions, requireIf, transformDate } from "../yup.util";

/**
 * Validation schema for client and contract-related data.
 */
export const LabelValidationSchema = Yup.object({
  labelId: Yup.string().nullable(),
  clientId: Yup.number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .required("Client is required"),
  labelName: Yup.string().required("Label Name is required"),
  labelStatus: oneOfOptions(LabelStatus, "Invalid type"),
});
