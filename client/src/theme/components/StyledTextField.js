import { TextField, InputBase, Typography, Box } from "@mui/material";
import { colors, hFontPrototype } from "../Theme";

const StyledTextField = (props) => {
  return (
    <Box sx={{ my: 1, width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Typography
          fontFamily={hFontPrototype}
          fontSize={12}
          sx={{ color: colors.MAINWHITE }}
        >
          {props.label}
        </Typography>
        {props.required && (
          <Typography
            fontFamily={hFontPrototype}
            fontSize={10}
            color={"#C60000"}
            sx={{ ml: 0.1 }}
          >
            {"*"}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          border: `2px solid ${colors.SUCCESS}`,
          backgroundColor: "transparent",
          pl: 1,
          caretColor: colors.MAINWHITE,
          "&:hover": {
            backgroundColor: "transparent",
          },
        }}
      >
        <InputBase
          {...props}
          sx={{
            flex: 1,
            font: "bold 18px Snowstorm Light, sans-serif",
            color: colors.MAINWHITE,
            ...props.sx,
          }}
        >
          {props.children}
        </InputBase>
      </Box>
    </Box>
    // <TextField
    //   margin="normal"
    //   {...props}
    //   sx={{
    //     borderRadius: 0,
    //     "& .MuiOutlinedInput-root": {
    //       "& fieldset": {
    //         borderColor: "#E0E3E7",
    //       },
    //       "&:hover fieldset": {
    //         borderColor: "#B2BAC2",
    //       },
    //       "&.Mui-focused fieldset": {
    //         borderColor: "#6F7E8C",
    //       },
    //     },
    //     ...props.sx,
    //   }}
    // >

    // </TextField>
  );
};

export default StyledTextField;
