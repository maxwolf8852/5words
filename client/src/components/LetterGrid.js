import Grid from "@mui/material/Unstable_Grid2";
import { Button, IconButton, Stack, Typography, Box } from "@mui/material";
import LetterBox from "../components/LetterBox";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const LetterGrid = ({ attempts, curAttempt, wrongWord }) => {
  let other = 30 - attempts?.length * 5 - curAttempt.length;

  return (
    <Grid container spacing={1} columns={5} sx={{ height: "100%" }}>
      {attempts &&
        attempts.map((attempt, i) => {
          return attempt?.word.map((letter, j) => {
            return (
              <Grid item xs={1}>
                <LetterBox
                  i={j}
                  letter={String.fromCharCode(letter.letter)}
                  color={letter.color}
                  flippable
                />
              </Grid>
            );
          });
        })}
      {[...curAttempt].map((e) => {
        return (
          <Grid item xs={1}>
            <LetterBox letter={e} wrongWord={wrongWord} />
          </Grid>
        );
      })}
      {Array(other)
        .fill(0)
        .map(() => (
          <Grid item xs={1}>
            <LetterBox letter={""} />
          </Grid>
        ))}
    </Grid>
  );
};

export default LetterGrid;
