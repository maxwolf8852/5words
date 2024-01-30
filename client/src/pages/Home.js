import backspaceImage from "../images/keyboard_backspace_FILL0_wght400_GRAD0_opsz24.svg";
import enterImage from "../images/check_FILL0_wght400_GRAD0_opsz24.svg";
import RedeemRoundedIcon from "@mui/icons-material/RedeemRounded";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import Grid from "@mui/material/Unstable_Grid2";
import { Button, IconButton, Stack, Typography, Box } from "@mui/material";
import LetterBox from "../components/LetterBox";
import Keyboard from "react-simple-keyboard";
import React, { useEffect, useRef, useState } from "react";
import { colors, hFontPrototype } from "../theme/Theme";

import "react-simple-keyboard/build/css/index.css";
import { apiSendAttempt, apiStatus } from "../api/Words";
import LetterGrid from "../components/LetterGrid";
import { states } from "../utils/consts";
import MonetizationOnTwoToneIcon from "@mui/icons-material/MonetizationOnTwoTone";
import StyledBackdrop from "../theme/components/StyledBackdrop";
import StatisticsDialog from "../dialogs/StatisticsDialog";

import confetti from "canvas-confetti";

const Home = ({ logout }) => {
  const keyboard = useRef();
  const [coins, setCoins] = useState(null);
  const [correctWord, setCorrectWord] = useState(null);
  const [attempts, setAttempts] = useState(null);
  const [canType, setCanType] = useState(false);
  const [dopen, setDOpen] = useState(false);
  const [curAttempt, setCurAttempt] = useState("");
  const [usedLetters, setUsedLetters] = useState("");
  const [successLetters, setSuccessLetters] = useState("");
  const [wrongposLetters, setWrongposLetters] = useState("");
  const [wrongWord, setWrongWord] = useState();
  const [edited, setEdited] = useState(0);
  const [attSended, setAttSended] = useState(false);

  var defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  function shoot() {
    confetti({
      ...defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }

  const onKeyPress = async (button) => {
    if (button === "{enter}" && curAttempt.length === 5) {
      console.log("Button pressed", button);
      const [resp, err] = await apiSendAttempt(curAttempt);
      setAttSended(true);
      if (err === null) {
        keyboard.current.input = { default: "" };
        setCurAttempt("");
        const resp2 = updateStatus();
      } else {
        console.log(err, err.message)
        if (err.message === "wordfreq") {
          setWrongWord(2);
        } else {
          setWrongWord(1);
        }
      }
    } else {
      setWrongWord(0);
    }
    // let [out, err] = await apiStatus();
  };
  const onChange = (input) => {
    console.log("Input changed", input, keyboard.current.input);
    setCurAttempt(input);
  };

  const updateStatus = (last) => {
    apiStatus().then((e) => {
      if (e[1] === null) {
        setAttempts(e[0].attempts);

        setCoins(e[0].coins);
        setCorrectWord(e[0].correct_word);
      } else {
        logout();
        console.error(e[1]);
        setTimeout(updateStatus, 500);
      }
    });
  };

  useEffect(() => {
    updateStatus(false);
  }, []);

  useEffect(() => {
    if (attSended && correctWord) {
      setTimeout(shoot, 0);
      setTimeout(shoot, 100);
      setTimeout(shoot, 200);
      setTimeout(shoot, 300);
      setTimeout(shoot, 400);
      setTimeout(shoot, 500);
    }
  }, [correctWord, attSended]);

  useEffect(() => {
    if (attempts) {
      let ul = "";
      let sl = "";
      let wpl = "";
      setCanType(attempts?.length < 6);
      for (const att of attempts) {
        if (att.completed) {
          setCanType(false);
        }
        console.log(att);
        for (const letter of att.word) {
          if (letter.color === states.WRONG) {
            ul += String.fromCharCode(letter.letter) + " ";
          } else if (letter.color === states.SUCCESS) {
            sl += String.fromCharCode(letter.letter) + " ";
          } else if (letter.color === states.NOT_POSITION) {
            wpl += String.fromCharCode(letter.letter) + " ";
          }
        }
      }
      setUsedLetters(ul);
      setSuccessLetters(sl);
      setWrongposLetters(wpl);
    }
  }, [attempts]);

  return (
    <Stack spacing={2} display="flex" height="100%">
      <StyledBackdrop open={coins === null} />
      <StatisticsDialog open={dopen} setOpen={setDOpen} />
      {coins !== null && (
        <>
          <Box
            sx={{
              p: 2,
              pt: 4,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ color: colors.MAINWHITE, fontFamily: hFontPrototype }}
              variant="h5"
            >
              5 БУКОВ
            </Typography>
            <Box sx={{ flexGrow: 1 }}></Box>
            <Box
              sx={{
                border: "1px solid white",
                borderRadius: 2,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                px: 1,
                py: 0.1,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#222",
                },
              }}
              onClick={() => setDOpen(true)}
            >
              <Typography
                sx={{
                  color: colors.MAINWHITE,
                  fontFamily: hFontPrototype,
                  pr: 0.8,
                }}
                variant="h5"
              >
                {coins}
              </Typography>

              <IconButton sx={{ p: 0, m: 0 }}>
                <MonetizationOnTwoToneIcon
                  fontSize="medium"
                  sx={{ color: colors.MAINWHITE }}
                />
              </IconButton>
            </Box>

            {/* <IconButton color="primary">
          <InfoRoundedIcon fontSize="large" sx={{ color: colors.MAINWHITE }} />
        </IconButton> */}

            <IconButton
              color="primary"
              onClick={() => {
                logout();
              }}
            >
              <LogoutRoundedIcon
                fontSize="large"
                sx={{ color: colors.MAINWHITE }}
              />
            </IconButton>
          </Box>
          <Box
            sx={{
              px: 3,
              // display: "flex",
              //justifyContent: "center",
            }}
          >
            {attempts && (
              <LetterGrid
                attempts={attempts}
                curAttempt={curAttempt}
                wrongWord={wrongWord}
              />
            )}
          </Box>
          {canType ? (
            <>
              <Box sx={{ flexGrow: 1 }}></Box>
              <Box sx={{}}>
                <Keyboard
                  keyboardRef={(r) => (keyboard.current = r)}
                  onChange={onChange}
                  onKeyPress={onKeyPress}
                  theme={"hg-theme-default hg-layout-default myTheme"}
                  layout={{
                    default: [
                      "й ц у к е н г ш щ з х ъ",
                      "ф ы в а п р о л д ж э",
                      "{enter} я ч с м и т ь б ю {bksp}",
                    ],
                  }}
                  buttonTheme={[
                    {
                      class: "hg-success",
                      buttons: successLetters,
                    },
                    {
                      class: "hg-used",
                      buttons: usedLetters,
                    },
                    {
                      class: "hg-wrongpos",
                      buttons: wrongposLetters,
                    },
                    curAttempt?.length === 5
                      ? {
                          class: "hg-success",
                          buttons: "{enter}",
                        }
                      : {},
                  ]}
                  display={{
                    "{bksp}": `<img class="button-img" src="${backspaceImage}" />`,
                    "{enter}": `<img class="button-img" src="${enterImage}" />`,
                  }}
                  mergeDisplay={true}
                  maxLength={5}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  sx={{
                    color: colors.MAINWHITE,
                    fontFamily: hFontPrototype,
                    pr: 0.8,
                  }}
                  variant="h5"
                >
                  Правильное слово:
                </Typography>
                <Typography
                  sx={{
                    color: colors.SUCCESS,
                    fontFamily: hFontPrototype,
                  }}
                  variant="h5"
                >
                  {correctWord}
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1 }}></Box>
            </Box>
          )}
        </>
      )}
    </Stack>
  );
};

export default Home;
