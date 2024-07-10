import axios from "axios";

// axios.defaults.baseURL = "http://192.168.20.213:5074";

export const getAllGaugeData = () => {
  return axios.get("https://localhost:7160/gauge");
};
