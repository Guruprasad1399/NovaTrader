import axios from "axios";

const API_KEY = "GRP01XABS0LVE";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export const fetchStockPrice = async (symbol: string) => {
  const apiUrl = `https://echios.tech/price/${symbol}?apikey=${API_KEY}`;
  const response = await axios.get(CORS_PROXY + apiUrl);
  return {
    symbol: response.data.symbol,
    price: response.data.price,
    time: response.data.time,
  };
};
