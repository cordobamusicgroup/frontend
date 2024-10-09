import * as Yup from "yup";
import dayjs from "dayjs";

/**
 * Validates if a value is a valid Dayjs object.
 * @param {any} value - The value to be checked.
 * @returns {boolean} - Returns true if the value is a valid Dayjs object, otherwise false.
 */
export const isValidDayjs = (value: any) => {
  return dayjs.isDayjs(value) && value.isValid();
};

/**
 * Checks if the date is in the future (after today).
 * @param {any} value - The date to be checked.
 * @returns {boolean} - Returns true if the date is in the future, otherwise false.
 */
export const isFutureDate = (value: any) => {
  return value && value.isAfter(dayjs().subtract(1, "day"));
};

/**
 * Validates that the current date field is after another date field.
 * @param {string} field - The field name to compare against.
 * @returns {function} - Returns a Yup test function that validates if one date is after another.
 */
export const isAfterField = (field: string) =>
  function (this: any, value: any) {
    const compareTo = this.parent[field];
    return value && compareTo && dayjs.isDayjs(value) && dayjs.isDayjs(compareTo) && value.isAfter(compareTo);
  };

/**
 * Validates that the current date field is before another date field.
 * @param {string} field - The field name to compare against.
 * @returns {function} - Returns a Yup test function that validates if one date is before another.
 */
export const isBeforeField = (field: string) =>
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
export const transformDate = (value: any, originalValue: any) => {
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
export const requireIf = (field: string, condition: any, message: string) => {
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
export const oneOfOptions = (options: any[], message: string) => {
  return Yup.string()
    .oneOf(
      options.map((option) => option.value),
      message
    )
    .required(message);
};
