"use client";
import ClientList from "@/components/organisms/clients/ClientList";
import { useAppDispatch } from "@/lib/redux/hooks";
import { setPageTitle } from "@/lib/redux/slices/pageDataSlice";

function PageManageClients() {
  const dispatch = useAppDispatch();
  dispatch(setPageTitle("Manage Clients"));

  return <ClientList />;
}
export default PageManageClients;
