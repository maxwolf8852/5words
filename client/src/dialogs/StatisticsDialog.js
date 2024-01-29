import { Dialog, Box, Grow, DialogTitle, Typography } from "@mui/material";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { forwardRef, useEffect, useState } from "react";
import { colors, hFontPrototype } from "../theme/Theme";
import { apiGetStatistics } from "../api/Words";
import { PieChart } from "@mui/x-charts";
import StatsString from "../components/StatsSring";
import Leaderboard from "../components/Leaderboard";

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const StatisticsDialog = ({ open, setOpen }) => {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    apiGetStatistics().then((e) => {
      if (e[1] === null) {
        setStats(e[0]);
      }
      console.log(e);
    });
  }, [open]);
  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        TransitionComponent={Transition}
        keepMounted={false}
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          backdropFilter: "blur(3px)",
          "& .MuiDialog-paper": {
            borderRadius: 1,
            border: `3px solid ${colors.SUCCESS}`,
            color: "white",
            boxShadow: "3px 3px black",
            backgroundColor: "#111",
          },
        }}
      >
        <DialogTitle sx={{ justifyContent: "center", display: "flex" }}>
          Статистика
        </DialogTitle>
        {stats && (
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ p: 1 }}>
              <Box
                sx={{
                  border: `1px solid ${colors.SUCCESS}`,
                  p: 1,
                  backgroundColor: "#222222",
                }}
              >
                {stats?.word_freqs && (
                  <PieChart
                    series={[
                      {
                        data: stats.word_freqs.map((e, i) => ({
                          id: i,
                          value: e.count,
                          label: e.word,
                        })),
                      },
                    ]}
                    width={300}
                    height={200}
                  />
                )}
              </Box>
            </Box>
            <Box sx={{ p: 1 }}>
              <StatsString
                value={stats.words.completed}
                text={"Количество угаданных слов:"}
              />
              <StatsString
                value={stats.attempts.count}
                text={"Количество попыток:"}
              />
              <StatsString
                value={parseInt(
                  stats.attempts.completed / stats.words.completed
                )}
                text={"Сред. кол. попыток на слово:"}
              />
            </Box>
            <Box sx={{ p: 1 }}>
              <Leaderboard />
            </Box>
          </Box>
        )}
      </Dialog>
    </ThemeProvider>
  );
};

export default StatisticsDialog;
