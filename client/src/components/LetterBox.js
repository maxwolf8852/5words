import { Box, Typography } from "@mui/material";
import { state_color } from "../utils/consts";
import Slide from "@mui/material/Slide";
import ReactCardFlip from "react-card-flip";
import { useEffect, useState } from "react";

const LetterBox = ({ letter, color, wrongWord, flippable, i }) => {
  // console.log(number);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (flippable) {
      setTimeout(() => setFlipped(true), 100 * i);

      console.log(letter);
    }
  }, [flippable]);
  return (
    <ReactCardFlip isFlipped={flipped}>
      <Box
        sx={{
          // width: 256,
          // height: 256,
          border: "2px solid #A5A73D",
          aspectRatio: "1 / 1",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: state_color[color + 1],
          // animation: "flip",
        }}
        className="front"
      >
        <Typography
          variant="h3"
          sx={{
            color:
              wrongWord === 0 ? "white" : wrongWord === 1 ? "red" : "purple",
          }}
        >
          {letter}
        </Typography>
      </Box>
      <Box
        sx={{
          // width: 256,
          // height: 256,
          border: "2px solid #A5A73D",
          aspectRatio: "1 / 1",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: state_color[color + 1],
          // animation: "flip",
        }}
        className="back"
      >
        <Typography
          variant="h3"
          sx={{
            color:
              wrongWord === 0 ? "white" : wrongWord === 1 ? "red" : "purple",
          }}
        >
          {letter}
        </Typography>
      </Box>
    </ReactCardFlip>
  );
};
export default LetterBox;
