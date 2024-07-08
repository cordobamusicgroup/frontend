import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

interface SignInFormProps {
  handleSubmit: (username: string, password: string) => void;
  loading: boolean;
}

/**
 * Sign In Form component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Function} props.handleSubmit - The function to handle form submission.
 * @param {boolean} props.loading - A flag indicating if the form is currently loading.
 * @returns {JSX.Element} The Sign In Form component.
 */
const SignInForm: React.FC<SignInFormProps> = ({ handleSubmit, loading }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the form submission.
   *
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
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
    <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
      <TextField margin="normal" required fullWidth id="username" label="Username" name="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} error={Boolean(error)} />
      <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={Boolean(error)} />
      {error && (
        <Typography variant="body2" color="error" align="center">
          {error}
        </Typography>
      )}
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
