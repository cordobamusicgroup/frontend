import FullScreenLoader from "@/components/global/molecules/FullScreenLoader";
import { Box, Skeleton, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box p={3}>
      <Skeleton animation="wave" width="60%" height={60} />
      <Skeleton animation="wave" variant="rectangular" width="100%" height={300} sx={{ marginY: 2 }} />
    </Box>
  );
}
