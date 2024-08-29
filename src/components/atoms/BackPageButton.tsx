import { ArrowBack } from "@mui/icons-material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

function BackPageButton() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  return (
    <Button variant="contained" color="primary" startIcon={<ArrowBack />} onClick={handleBack}>
      Back
    </Button>
  );
}
export default BackPageButton;
