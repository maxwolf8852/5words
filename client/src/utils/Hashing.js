export const hash = (message) => {
  const shajs = require("sha.js");
  return shajs("sha384").update(message).digest("hex");
};
