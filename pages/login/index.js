import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleForgotPassword = () => {
    setView("forgot");
  };

  const handleBackToLogin = () => {
    setView("login");
  };

  const handleLogin = async () => {
    await fetch(`${process.env.BACKEND_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "access-control-allow-headers":"Origin,X-Requested-With,Content-Type,Accept,content-type,application/json"
        },
        body: JSON.stringify({
            email,
            password,
        }),
    })
    .then((res) => {
        if(res.status === 200){
            console.log('Autenticado')
        }
        else{
            console.log('Não autenticado')
        }
    })
    
  };

  const handleResetPassword = () => {
    // Perform reset password action here
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4">
          <img src="/images/brandLogo.png" alt="Logo" width="160" />
        </Typography>
        {view === "login" ? (
          <>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              color="success"
            />
            <TextField
              color="success"
              margin="normal"
              fullWidth
              name="password"
              label="Senha"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginBottom: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    name="remember"
                    color="success"
                  />
                }
                label="Manter logado"
              />
              <Button
                size="medium"
                color="success"
                sx={{
                  textTransform: "capitalize",
                }}
                onClick={handleForgotPassword}
              >
                Redefinir senha
              </Button>
            </Box>
            <Button
                size="large"
              color="success"
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleLogin}
            >
              <b>Entrar</b>
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h6">
              Digite seu email para receber um link de verificação
            </Typography>
            <TextField
              color="success"
              margin="normal"
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              color="success"
              size="large"
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleResetPassword}
            >
              Enviar
            </Button>
            <Button color="success" sx={{ marginTop: 5 }} onClick={handleBackToLogin}>
              Voltar
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
