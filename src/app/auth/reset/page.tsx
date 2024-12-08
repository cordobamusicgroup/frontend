import React from "react";
import ResetLayout from "@/components/auth/reset/ResetPassword";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
};

const ResetPasswordPage: React.FC = () => {
  return <ResetLayout />;
};

export default ResetPasswordPage;
