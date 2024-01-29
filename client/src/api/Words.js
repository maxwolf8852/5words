import { serverTarget } from "../utils/consts";

export const apiStatus = async () => {
  try {
    let response = await fetch(`${serverTarget}/words/status`, {
      method: "GET",
      credentials: "include",
      // mode: "no-cors",
    });

    const j = await response.json();

    return [j, null];
  } catch (e) {
    console.error(e);

    return [null, e];
  }
};

export const apiSendAttempt = async (attempt) => {
  try {
    let response = await fetch(`${serverTarget}/words/attempt/${attempt}`, {
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

export const apiGetStatistics = async () => {
  try {
    let response = await fetch(`${serverTarget}/words/statistics`, {
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
