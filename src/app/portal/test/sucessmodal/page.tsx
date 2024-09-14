"use client";
import SuccessModal from "@/components/molecules/modals/SucessModal";

export default function SucessTest() {
  return <SuccessModal open onClose={() => {}} title="Success!" message="Your form has been submitted successfully." />;
}
