import * as Yup from "yup";
import dayjs from "dayjs";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions } from "@/constants/backend.enums";

/**
 * Validates if a value is a valid Dayjs object.
 * @param {any} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is a valid Dayjs object, otherwise false.
 */
const isValidDayjs = (value: any) => {
  return dayjs.isDayjs(value) && value.isValid();
};

/**
 * Checks if the date is in the future (after today).
 * @param {any} value - The date to be checked.
 * @returns {boolean} - Returns true if the date is in the future, otherwise false.
 */
const isFutureDate = (value: any) => {
  return value && value.isAfter(dayjs().subtract(1, "day"));
};

/**
 * Validates that the current date field is after another date field.
 * @param {string} field - The field name to compare against.
 * @returns {function} - Returns a Yup test function that validates if one date is after another.
 */
const isAfterField = (field: string) =>
  function (this: any, value: any) {
    const compareTo = this.parent[field];
    return value && compareTo && dayjs.isDayjs(value) && dayjs.isDayjs(compareTo) && value.isAfter(compareTo);
  };

/**
 * Validates that the current date field is before another date field.
 * @param {string} field - The field name to compare against.
 * @returns {function} - Returns a Yup test function that validates if one date is before another.
 */
const isBeforeField = (field: string) =>
  function (this: any, value: any) {
    const compareTo = this.parent[field];
    return value && compareTo && dayjs.isDayjs(value) && dayjs.isDayjs(compareTo) && value.isBefore(compareTo);
  };

/**
 * Transforms a date field to ensure it is either a valid Dayjs object or null.
 * @param {any} value - The current value.
 * @param {any} originalValue - The original value provided to the field.
 * @returns {Dayjs|null} - Returns a valid Dayjs object if possible, otherwise null.
 */
const transformDate = (value: any, originalValue: any) => {
  if (!originalValue || originalValue === "") return null;
  const parsedDate = dayjs(originalValue);
  return parsedDate.isValid() ? parsedDate : null;
};

/**
 * Conditionally requires a field based on another field's value.
 * @param {string} field - The name of the field to check.
 * @param {any} condition - The condition that, if met, requires the field.
 * @param {string} message - The error message to display if the field is required but not provided.
 * @returns {Yup.StringSchema} - Returns a Yup schema that conditionally requires the field.
 */
const requireIf = (field: string, condition: any, message: string) => {
  return Yup.string().when(field, {
    is: condition,
    then: (schema) => schema.required(message),
    otherwise: (schema) => schema.nullable(),
  });
};

/**
 * Creates a Yup schema that validates if a field's value matches one of the provided options.
 * @param {Array<Object>} options - The list of valid options.
 * @param {string} message - The error message to display if the value is invalid.
 * @returns {Yup.StringSchema} - Returns a Yup schema that validates the field against the options.
 */
const oneOfOptions = (options: any[], message: string) => {
  return Yup.string()
    .oneOf(
      options.map((option) => option.value),
      message
    )
    .required(message);
};

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
