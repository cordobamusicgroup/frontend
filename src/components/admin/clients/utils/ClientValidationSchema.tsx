import * as Yup from "yup";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions } from "@/constants/backend.enums";
import { oneOfOptions, requireIf, transformDate, isValidDayjs, isAfterField, isFutureDate } from "@/components/global/utils/yup.util";

/**
 * Validation schema for client and contract-related data.
 */
export const ClientValidationSchema = Yup.object({
  clientId: Yup.string().nullable(),
  clientName: Yup.string().required("Client nickname is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),

  // Validating type with options
  type: oneOfOptions(typeOptions, "Invalid type"),
  taxIdType: oneOfOptions(taxIdTypeOptions, "Invalid Tax ID Type"),

  taxId: Yup.string().required("Tax ID is required"),
  vatRegistered: Yup.boolean().required(),
  vatId: requireIf("vatRegistered", true, "VAT ID is required when VAT Registered is true"),

  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),

  // Validating and transforming countryId
  countryId: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Country is required"),

  zip: Yup.string().required("Zip is required"),
  contractUUID: Yup.string().nullable(),

  // Validating contractType and contractStatus with options
  contractType: oneOfOptions(contractTypeOptions, "Invalid contract type"),
  contractStatus: oneOfOptions(contractStatusOptions, "Invalid contract status"),

  ppd: requireIf("contractStatus", "ACTIVE", "PPD is required"),
  docUrl: requireIf("contractStatus", "ACTIVE", "Document URL is required"),

  startDate: Yup.mixed()
    .nullable()
    .transform(transformDate)
    .when("contractStatus", {
      is: (value: string) => value === "ACTIVE" || value === "TERMINATED",
      then: (schema) => schema.required("Start date is required").test("isValidDayjs", "Invalid date", isValidDayjs),
      otherwise: (schema) => schema.nullable(),
    }),

  endDate: Yup.mixed()
    .nullable()
    .transform(transformDate)
    .when("contractStatus", {
      is: "TERMINATED",
      then: (schema) => schema.required("End date is required").test("isValidDayjs", "Invalid date", isValidDayjs).test("isAfterStartDate", "End date must be after start date", isAfterField("startDate")).test("isFutureDate", "End date cannot be in the past", isFutureDate),
      otherwise: (schema) => schema.nullable(),
    }),
  contractSigned: Yup.boolean().required(),
  contractSignedBy: requireIf("contractStatus", (status: string) => status !== "DRAFT", "Signed by is required"),
  contractSignedAt: Yup.mixed()
    .nullable()
    .transform(transformDate)
    .when("contractStatus", {
      is: (value: string) => value !== "DRAFT",
      then: (schema) => schema.required("Signed at is required").test("isValidDayjs", "Invalid date", isValidDayjs),
      otherwise: (schema) => schema.nullable(),
    }),
});
