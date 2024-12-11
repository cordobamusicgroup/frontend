import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { useUsersAdmin } from "@/lib/hooks/admin/hookUsersAdmin";
import routes from "@/lib/routes/routes";
import ActionButtonsClient from "@/components/global/molecules/ActionsButtonsClient";
import GridTables from "@/components/global/molecules/GridTables";
import { useRouter } from "next/navigation";
import useQuickFilter from "@/lib/hooks/useQuickFilter";
import SearchBoxTable from "@/components/global/molecules/SearchBoxTable";
import { AgGridReact } from "@ag-grid-community/react";
import { useClients } from "@/lib/hooks/admin/hookClientsAdmin";
import TableSkeletonLoader from "@/components/global/molecules/TableSkeletonLoader";
import { isMobile } from "@/theme";

interface UsersTableProps {
  setNotification: (notification: { message: string; type: "success" | "error" }) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ setNotification }) => {
  const router = useRouter();
  const web = routes.web;
  const { userData = [], userFetchLoading, deleteUsers, userError, userLoading } = useUsersAdmin();
  const { clientData = [], clientLoading, deleteClients, clientError } = useClients();

  const gridRef = useRef<AgGridReact>(null);

  const { searchTextRef, quickFilterText, applyFilter, resetFilter } = useQuickFilter();
  const [selectedRows, setSelectedRows] = useState<any[]>([]); // Almacena las filas seleccionadas para eliminar TODO
  const handleEdit = (user: any): void => {
    router.push(`${web.admin.users.edit}/${user.id}`);
  };

  const handleDelete = async (userId: number): Promise<void> => {
    if (await deleteUsers([userId])) {
      setNotification({ message: "User deleted successfully", type: "success" });
    }
  };

  useEffect(() => {
    if (userError) {
      setNotification({ message: userError, type: "error" });
    }
  }, [userError, setNotification]);

  const columns = [
    { field: "id", headerName: "ID", width: 80, sortable: false, filter: false, resizable: false, flex: 0 },
    { field: "username", headerName: "Username", width: 200 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "fullName", headerName: "Full Name", width: 200 },
    {
      field: "client",
      headerName: "Client",
      width: 300,
      cellRenderer: (params: any) => {
        if (clientLoading) {
          return <TableSkeletonLoader />;
        }
        const client = clientData.find((client: any) => client.id === params.data.clientId);
        return client ? `${client.clientName} (${client.id})` : "No client found";
      },
    },
    { field: "role", headerName: "Role", width: 150 },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      minWidth: 100,
      sortable: false,
      filter: false,
      resizable: false,
      flex: 1,
      cellRenderer: (params: any) => <ActionButtonsClient onEdit={() => handleEdit(params.data)} onDelete={() => handleDelete(params.data.id)} />,
    },
  ];

  const rowData = userData.map((user: any) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    clientId: user.clientId, // Ensure clientId is included in rowData
  }));

  const defaultColDef = {
    flex: isMobile() ? 0 : 1,
    sortable: false,
    resizable: false,
    filter: true,
  };

  if (clientLoading) {
    return <TableSkeletonLoader />;
  }

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <SearchBoxTable searchTextRef={searchTextRef} applyFilter={applyFilter} resetFilter={resetFilter} />
      <GridTables ref={gridRef} columns={columns} rowData={rowData} loading={userFetchLoading || userLoading} quickFilterText={quickFilterText} defaultColDef={defaultColDef} />
    </Box>
  );
};

export default UsersTable;
