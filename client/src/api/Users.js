import { serverTarget } from "../utils/consts";

export const apiLeaderboard = async () => {
  try {
    let response = await fetch(`${serverTarget}/users/leaderboard`, {
      method: "GET",
      credentials: "include",
      //   mode: "no-cors",
    });

    const j = await response.json();

    return [j, null];
  } catch (e) {
    console.error(e);
    return [null, e];
  }
};
