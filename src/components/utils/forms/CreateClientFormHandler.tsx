import { useCreateClient } from "@/lib/hooks/clients/useCreateClient";
import { SubmitHandler } from "react-hook-form";

export const CreateClientFormHandlerSubmit: SubmitHandler<any> = async (
  values, // Los valores del formulario
  { reset }, // reset viene de React Hook Form
  setSuccessMessage, // Para manejar mensajes de éxito
  setErrorMessages, // Para manejar los mensajes de error
  setErrorOpen // Para abrir el popup de error
) => {
  const { createClient } = useCreateClient();

  try {
    // Creación del payload basado en los valores del formulario
    const payload = {
      clientName: values.clientName,
      firstName: values.firstName,
      lastName: values.lastName,
      type: values.type,
      taxIdType: values.taxIdType,
      taxId: values.taxId,
      vatRegistered: values.vatRegistered,
      vatId: values.vatId,
      address: {
        street: values.street,
        city: values.city,
        state: values.state,
        countryId: values.countryId,
        zip: values.zip,
      },
      contract: {
        contractType: values.contractType,
        status: values.contractStatus,
        signed: values.contractSigned,
        signedBy: values.contractSignedBy,
        signedAt: values.contractSignedAt,
        startDate: values.startDate,
        endDate: values.endDate,
        ppd: values.ppd,
        docUrl: values.docUrl,
      },
    };

    // Enviamos los datos a la API
    await createClient(payload);
    setSuccessMessage("The client was successfully created.");
    reset(); // Reinicia el formulario
  } catch (error: any) {
    // Manejo de errores, mostrando el mensaje del servidor si existe
    if (error.response && error.response.data && error.response.data.message) {
      setErrorMessages([error.response.data.message]);
    } else {
      setErrorMessages(["An unexpected error occurred."]);
    }
    setErrorOpen(true); // Abre el popup de errores
  }
};
