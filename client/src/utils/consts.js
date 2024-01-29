const serverHost = "45.9.41.50"; //"10.5.7.71"; "10.0.170.225" //"/api";
const serverPort = ":8435"; //":8888"; //""; <-- add nginx proxy
export const serverIP = `${serverHost}${serverPort}`;
export const serverProto = `http`;
export const serverTarget = `${serverProto}://${serverIP}`;

export const states = {
  NOTHING: -1,
  WRONG: 0,
  NOT_POSITION: 1,
  SUCCESS: 2,
};

export const state_color = ["#111", "#222", "#777", "#985"];
