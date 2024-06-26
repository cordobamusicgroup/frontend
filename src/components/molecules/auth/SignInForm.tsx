import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

interface SignInFormProps {
  handleSubmit: (username: string, password: string) => void;
  loading: boolean;
}

const SignInForm: React.FC<SignInFormProps> = ({ handleSubmit, loading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (username.trim() === "" || password.trim() === "") {
      setError("Username and password are required");
      return;
    }

    setError(null);
    handleSubmit(username, password);
  };

  return (
    <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 1 }}>
      <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} error={Boolean(error)} />
      <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={Boolean(error)} />
      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}
      <FormControlLabel control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} color="primary" />} label="Remember me" />
      <Box sx={{ position: "relative" }}>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
        
      </Box>
      <Grid container justifyContent="center">
        <Grid item>
          <Link href="#" variant="body2">
            Forgot password or username?
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignInForm;
