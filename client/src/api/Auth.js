import { serverTarget } from "../utils/consts";
import { hash } from "../utils/Hashing";

export const apiLogin = async (values) => {
  const values_hashed = {
    username: values.username,
    password: hash(values.password),
  };
  const data = JSON.stringify(values_hashed);

  try {
    let response = await fetch(`${serverTarget}/users/login`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/json",
      },
      // mode: "no-cors",
      //referrerPolicy: "no-referrer",
    });

    return [await response.json(), null];
  } catch (e) {
    console.error(e);
    return [null, e];
  }
};
