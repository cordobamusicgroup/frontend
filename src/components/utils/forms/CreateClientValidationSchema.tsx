import * as Yup from "yup";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions } from "@/constants/client-enums";
import dayjs from "dayjs";

export const CreateClientValidationSchema = Yup.object({
  clientName: Yup.string().required("Client nickname is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  type: Yup.string()
    .oneOf(
      typeOptions.map((option) => option.value),
      "Invalid type"
    )
    .required("Type is required"),
  taxIdType: Yup.string()
    .oneOf(
      taxIdTypeOptions.map((option) => option.value),
      "Invalid Tax ID Type"
    )
    .required("Tax ID Type is required"),
  taxId: Yup.string().required("Tax ID is required"),
  vatRegistered: Yup.boolean().required(),
  vatId: Yup.string().when("vatRegistered", {
    is: true,
    then: (schema) => schema.required("VAT ID is required when VAT Registered is true"),
    otherwise: (schema) => schema.nullable().notRequired(),
  }),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),

  // Manejo de `countryId` para evitar NaN
  countryId: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value)) // Transforma "" en null
    .nullable() // Permite que null sea un valor válido
    .required("Country is required"), // Si es null o NaN, muestra "Country is required"

  zip: Yup.string().required("Zip is required"),
  contractType: Yup.string()
    .oneOf(
      contractTypeOptions.map((option) => option.value),
      "Invalid contract type"
    )
    .required("Contract type is required"),
  contractStatus: Yup.string()
    .oneOf(
      contractStatusOptions.map((option) => option.value),
      "Invalid contract status"
    )
    .required("Contract Status is required"),

  ppd: Yup.string().when("contractStatus", {
    is: "ACTIVE",
    then: (schema) => schema.required("PPD is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  docUrl: Yup.string().when("contractStatus", {
    is: "ACTIVE",
    then: (schema) => schema.required("Document URL is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  // Manejo de `startDate` para evitar `Invalid Date`
  startDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value)) // Transforma "" en null
    .nullable() // Permite que null sea un valor válido
    .when("contractStatus", {
      is: (value: string) => value === "ACTIVE" || value === "TERMINATED",
      then: (schema) =>
        schema
          .required("Start date is required")
          .test("isValidDate", "Invalid date", (value) => (value ? dayjs(value).isValid() : false))
          .test("isFutureDate", "Start date cannot be in the past", (value) => (value ? dayjs(value).isAfter(dayjs().subtract(1, "day")) : false)),
      otherwise: (schema) => schema.nullable(),
    }),

  // Manejo de `endDate` para evitar `Invalid Date`
  endDate: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value)) // Transforma "" en null
    .nullable() // Permite que null sea un valor válido
    .when("contractStatus", {
      is: "TERMINATED",
      then: (schema) =>
        schema
          .required("End date is required")
          .test("isAfterStartDate", "End date must be after start date", function (value) {
            const { startDate } = this.parent;
            return value && startDate ? dayjs(value).isAfter(dayjs(startDate)) : false;
          })
          .test("isFutureDate", "End date cannot be in the past", (value) => (value ? dayjs(value).isAfter(dayjs().subtract(1, "day")) : false)),
      otherwise: (schema) => schema.nullable(),
    }),

  contractSignedBy: Yup.string().when("contractStatus", {
    is: "DRAFT",
    then: (schema) => schema.nullable(),
    otherwise: (schema) => schema.required("Signed by is required"),
  }),

  contractSignedAt: Yup.date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .when("contractStatus", {
      is: "DRAFT",
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.required("Signed at is required").test("isValidDate", "Invalid date", (value) => (value ? dayjs(value).isValid() : false)),
    }),
});
