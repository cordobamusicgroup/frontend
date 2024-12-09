import { Box, Skeleton } from "@mui/material";

const FormSkeletonLoader: React.FC = () => {
  return (
    <Box p={3} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Skeleton variant="text" height={50} />
      <Skeleton variant="rectangular" width="100%" height={300} />
    </Box>
  );
};

export default FormSkeletonLoader;
