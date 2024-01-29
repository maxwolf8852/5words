import { Box, Typography } from "@mui/material";
import { colors, hFontPrototype } from "../theme/Theme";

const StatsString = ({ value, text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "end",
      }}
    >
      <Typography
        sx={{
          color: colors.MAINWHITE,
          fontFamily: hFontPrototype,
          pr: 0.6,
        }}
        variant="h7"
      >
        {text}
      </Typography>
      <Typography
        sx={{ color: colors.SUCCESS, fontFamily: hFontPrototype }}
        variant="h7"
      >
        {isNaN(value) ? 0 : value}
      </Typography>
    </Box>
  );
};

export default StatsString;
