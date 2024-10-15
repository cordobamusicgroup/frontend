import React from "react";
import { VatStatusChip } from "../atoms/ClientChips";
import ActionButtonsClient from "./ActionsButtonsClient";

interface ClientRowProps {
  client: any;
  onEdit: (client: any) => void;
  onView: (client: any) => void;
  onDelete: (client: any) => void;
}

function ClientRow({ client, onEdit, onView, onDelete }: ClientRowProps) {
  return {
    id: client.id,
    clientName: client.clientName,
    firstName: client.firstName,
    lastName: client.lastName,
    type: client.type,
    taxIdType: client.taxIdType,
    taxId: client.taxId,
    vatRegistered: <VatStatusChip isRegistered={client.vatRegistered} />,
    vatId: client.vatId,
    actions: <ActionButtonsClient onEdit={() => onEdit(client)} onDelete={() => onDelete(client)} />,
  };
}

export default ClientRow;
