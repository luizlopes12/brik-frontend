import React, { useState, useContext } from "react";
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
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import style from "./style.module.scss";
import { useRouter } from "next/router";
import Cookie from "js-cookie";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import nextCookies from "next-cookies";

export async function getServerSideProps(context) {
  const cookies = nextCookies(context);
  const { token, refreshToken } = cookies ? cookies : {};

  if (token || refreshToken) {
    return {
      redirect: {
        destination: "/admin",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}

const LoginPage = () => {
  const [view, setView] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAlert, setLoginAlert] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = () => {
    setView("forgot");
  };

  const handleBackToLogin = () => {
    setView("login");
  };

  const handleLogin = async () => {
    setLoading(true);
    await fetch(`${process.env.BACKEND_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "access-control-allow-headers":
          "Origin,X-Requested-With,Content-Type,Accept,content-type,application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json();
        } else {
          setLoginAlert("Email ou senha incorretos");
        }
        setLoading(false);
      })
      .then((data) => {
        if (data && data.token && data.refreshToken) {
          Cookie.set("name", data.name);
          Cookie.set("email", data.email);
          Cookie.set("phone", data.phone);
          Cookie.set(
            "permissions",
            JSON.stringify({
              admin: data.admin,
              editDivisions: data.editDivisions,
              editLots: data.editLots,
              editPartners: data.editPartners,
              editBanners: data.editBanners,
              editTaxes: data.editTaxes,
            })
          );
          Cookie.set("token", data.token, { expires: 1 });
          Cookie.set("refreshToken", data.refreshToken, { expires: 1 });
          if (rememberMe) {
            Cookie.set("refreshToken", data.refreshToken, { expires: 7 });
          }
          router.push("/admin");
        }
      });
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
        <Typography
          className={style.brandLogo}
          variant="h4"
          onClick={() => router.push("/")}
        >
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
              {/* <Button
                size="medium"
                color="success"
                sx={{
                  textTransform: "capitalize",
                }}
                onClick={handleForgotPassword}
              >
                Redefinir senha
              </Button> */}
            </Box>
            <Button
              size="large"
              color="success"
              type="submit"
              fullWidth
              variant="contained"
              onClick={handleLogin}
            >
              {loading ? (
                <CircularProgress color="inherit" size={28} />
              ) : (
                <b>Entrar</b>
              )}
            </Button>
            <p className={style.alertMessage}>{loginAlert && loginAlert}</p>
            <Button
              color="success"
              className={style.backToHome}
              size="small"
              onClick={() => router.push("/")}
            >
              <ArrowBackIosNewIcon fontSize="small" />
              Voltar
            </Button>
          </>
        ) : (
          <>
            <Typography variant="h7">
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
            <Button
              color="success"
              className={style.backToHome}
              size="large"
              sx={{ marginTop: 5 }}
              onClick={handleBackToLogin}
            >
              <ArrowBackIosNewIcon fontSize="small" />
              Voltar
            </Button>
          </>
        )}
      </Box>
    </Container>
  );
};

export default LoginPage;
