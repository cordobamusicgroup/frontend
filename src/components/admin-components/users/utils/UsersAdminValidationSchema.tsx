import * as Yup from "yup";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions } from "@/constants/backend.enums";
import { oneOfOptions, requireIf, transformDate, isValidDayjs, isAfterField, isFutureDate, isNotEmpty } from "@/components/global/utils/yup.util";

/**
 * Validation schema for user-related data.
 */
export const UserAdminValidationSchema = Yup.object({
  clientId: Yup.mixed().nullable(),
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  fullName: Yup.string().required("Full name is required"),
  role: Yup.string().oneOf(["ADMIN", "USER"], "Invalid role").required("Role is required"),
});
