import { Box, CircularProgress, Typography } from "@mui/material";
import { colors, hFontPrototype } from "../theme/Theme";
import StyledTextField from "../theme/components/StyledTextField";
import StyledButtton from "../theme/components/StyledButton";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useState } from "react";
import { apiLogin } from "../api/Auth";

const Login = ({ login }) => {
  const [isLoading, setLoading] = useState(false);
  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      username: data.get("username"),
      password: data.get("password"),
    };
    console.info(values);

    const [out_data, error] = await apiLogin(values);
    if (out_data?.token) {
      console.log("login!");
      login(out_data.token, values.username, "");
    } else {
      //   notify("401: " + error);
      console.error(error);
    }

    setLoading(false);
  };
  return (
    <Box sx={{ p: 1 }}>
      <Box
        sx={{
          mt: "40%",
          border: `3px solid ${colors.SUCCESS}`,
          borderRadius: 1,
          p: 1,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          sx={{ color: colors.MAINWHITE, fontFamily: hFontPrototype }}
          variant="h5"
        >
          Войти
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            width: "100%",
          }}
        >
          <StyledTextField
            required
            fullWidth
            id="username"
            name="username"
            label="Имя пользователя"
            autoComplete="username"
            autoFocus
          />
          <StyledTextField
            required
            fullWidth
            id="password"
            name="password"
            label="Пароль"
            type="password"
            autoComplete="current-password"
          />

          <Box sx={{ width: "100%", display: "flex", py: 1 }}>
            <Box sx={{ flexGrow: 1 }} />
            <StyledButtton type="submit">
              {isLoading ? (
                <CircularProgress color="inherit" size={24} />
              ) : (
                <ArrowForwardRoundedIcon />
              )}
            </StyledButtton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
