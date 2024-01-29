import { Button } from "@mui/material";
import { colors, hFontPrototype } from "../Theme";

const StyledButtton = (props) => {
  const shadowColor = props.disabled ? "#555" : "#000";
  return (
    <Button
      variant={"outlined"}
      {...props}
      sx={{
        backgroundColor: colors.SUCCESS,
        border: "2px solid #000",
        borderRadius: 1,
        color: "#000",
        boxShadow: `3px 3px ${shadowColor}`,
        p: 0.8,
        mb: "3px",
        font: "18px Snowstorm Light, sans-serif",
        fontWeight: 800,
        "&:hover": {
          border: "2px solid #111",
          backgroundColor: colors.MAINWHITE,
        },
        ...props.sx,
      }}
    >
      {props.children}
    </Button>
  );
};

export default StyledButtton;
