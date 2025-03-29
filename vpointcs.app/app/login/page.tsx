"use client";

import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      // Cek tipe konten dari response
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server tidak merespon dengan format JSON. Mohon periksa koneksi ke server API.");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login gagal");
      }

      // Simpan token
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          backgroundColor: "background.paper",
          borderRadius: 1,
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          className="text-primary-main mb-4"
        >
          VPoint Customer Service
        </Typography>
        {error && (
          <Alert severity="error" className="mb-4 w-full">
            {error}
          </Alert>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1 }}
          className="w-full"
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="User ID"
            name="userName"
            autoComplete="username"
            autoFocus
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            className="mb-4"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '28px',
                '& fieldset': {
                  borderColor: 'primary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.dark',
                },
              },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className="mb-6"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '28px',
                '& fieldset': {
                  borderColor: 'primary.main',
                },
                '&:hover fieldset': {
                  borderColor: 'primary.dark',
                },
              },
            }}
            InputProps={{
              sx: {
                '& .MuiInputAdornment-root .MuiIconButton-root': {
                  color: 'primary.main'
                }
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            className="bg-primary-main hover:bg-primary-dark mt-6"
            sx={{
              borderRadius: '28px',
              padding: '12px 0',
              marginTop: '24px',
              '&:hover': {
                backgroundColor: 'primary.dark',
                transform: 'scale(1.02)',
                transition: 'all 0.2s ease-in-out'
              }
            }}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
