import dayjs from "dayjs";

export const CreateClientInitialValues = {
  clientName: "",
  firstName: "",
  lastName: "",
  type: "",
  taxIdType: "",
  taxId: "",
  vatRegistered: false,
  vatId: "",
  street: "",
  city: "",
  state: "",
  countryId: null,
  zip: "",
  contractType: "",
  contractStatus: "",
  ppd: "",
  docUrl: "",
  startDate: dayjs(Date.now()),
};
