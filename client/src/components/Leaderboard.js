import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { hFontPrototype } from "../theme/Theme";
import { useEffect, useState } from "react";
import { apiLeaderboard } from "../api/Users";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en.json";
import ru from "javascript-time-ago/locale/ru.json";

import ReactTimeAgo from "react-time-ago";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const Leaderboard = () => {
  const [lb, setLb] = useState(null);
  useEffect(() => {
    apiLeaderboard().then((e) => {
      if (e[1] === null) {
        setLb(e[0]);
      }
    });
  }, []);

  return (
    lb && (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 300 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {/* <TableCell sx={{ fontFamily: hFontPrototype }}>Место</TableCell> */}
              <TableCell sx={{ fontFamily: hFontPrototype }}>
                Пользователь
              </TableCell>
              <TableCell sx={{ fontFamily: hFontPrototype }}>Рейтинг</TableCell>
              <TableCell sx={{ fontFamily: hFontPrototype }}>Онлайн</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lb.map((el, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* <TableCell align="right">{i}</TableCell> */}
                <TableCell align="left">{el.username}</TableCell>
                <TableCell align="left">{el.rating}</TableCell>
                <TableCell align="left">
                  {<ReactTimeAgo date={el.interact} locale="ru" />}
                </TableCell>
              </TableRow>
            ))}
            {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow> 
          ))}*/}
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
};

export default Leaderboard;
