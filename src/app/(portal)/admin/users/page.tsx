import React from "react";
import { Metadata } from "next";
import UserListPage from "@/components/admin/users/pages/UsersListPage";

export const metadata: Metadata = {
  title: "Users",
};

export default function ManageUsers() {
  return <UserListPage />;
}
