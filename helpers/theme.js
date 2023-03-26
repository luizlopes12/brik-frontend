import { createTheme } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: {
      main: "#63C600",
    },
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#63C600",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#63C600",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#63C600",
          },
        },
      },
    },
  },
});

export default theme;
