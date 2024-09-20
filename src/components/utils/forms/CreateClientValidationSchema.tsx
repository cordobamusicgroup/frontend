import * as Yup from "yup";
import { typeOptions, taxIdTypeOptions, contractTypeOptions, contractStatusOptions } from "@/constants/client-enums";
import dayjs from "dayjs";

// Validación para comprobar si el valor es un Dayjs válido
const isValidDayjs = (value: any) => {
  // Asegurarse de que 'value' es un objeto Dayjs antes de llamar 'isValid'
  return dayjs.isDayjs(value) && value.isValid();
};

// Validación para comprobar si la fecha está en el futuro
const isFutureDate = (value: any) => {
  return value && value.isAfter(dayjs().subtract(1, "day"));
};

// Validación para comprobar si una fecha es posterior a otro campo
const isAfterField = (field: string) =>
  function (this: any, value: any) {
    const compareTo = this.parent[field];
    return value && compareTo && dayjs.isDayjs(value) && dayjs.isDayjs(compareTo) && value.isAfter(compareTo);
  };

// Validación para comprobar si una fecha es anterior a otro campo
const isBeforeField = (field: string) =>
  function (this: any, value: any) {
    const compareTo = this.parent[field];
    return value && compareTo && dayjs.isDayjs(value) && dayjs.isDayjs(compareTo) && value.isBefore(compareTo);
  };

// Transformación de fecha para asegurar un valor Dayjs válido o null
// Transformación de fecha para asegurar un valor Dayjs válido o null
const transformDate = (value: any, originalValue: any) => {
  if (!originalValue || originalValue === "") return null;
  const parsedDate = dayjs(originalValue);
  return parsedDate.isValid() ? parsedDate : null;
};

// Función de ayuda para validar condicionalmente un campo requerido
const requireIf = (field: string, condition: any, message: string) => {
  return Yup.string().when(field, {
    is: condition,
    then: (schema) => schema.required(message),
    otherwise: (schema) => schema.nullable(),
  });
};

// Función para crear campos con .oneOf basado en las opciones
const oneOfOptions = (options: any[], message: string) => {
  return Yup.string()
    .oneOf(
      options.map((option) => option.value),
      message
    )
    .required(message);
};

// Creación del esquema de validación
export const CreateClientValidationSchema = Yup.object({
  clientId: Yup.string().nullable(),
  clientName: Yup.string().required("Client nickname is required"),
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),

  // Uso de la función para validar "oneOf" con opciones
  type: oneOfOptions(typeOptions, "Invalid type"),
  taxIdType: oneOfOptions(taxIdTypeOptions, "Invalid Tax ID Type"),

  taxId: Yup.string().required("Tax ID is required"),
  vatRegistered: Yup.boolean().required(),
  vatId: requireIf("vatRegistered", true, "VAT ID is required when VAT Registered is true"),

  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),

  // Validación y transformación de countryId
  countryId: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .nullable()
    .required("Country is required"),

  zip: Yup.string().required("Zip is required"),
  contractUUID: Yup.string().nullable(),

  // Uso de la función para validar "oneOf" con opciones
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
