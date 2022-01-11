import {
  CryptocurrencyDataResponse,
  CryptocurrencyData,
} from "../../global/models/CryptoData.js";
import fetch from "node-fetch";

export const getStrongCryptocurrencyData = async () => {
  try {
    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=USD&ids=strong`;
    const strongCryptocurrencyDataRes = await fetch(url);
    if (!strongCryptocurrencyDataRes.ok)
      throw strongCryptocurrencyDataRes.headers;
    const strongCryptocurrencyDataObj =
      (await strongCryptocurrencyDataRes.json()) as CryptocurrencyData;
    const strongCryptocurrencyData: CryptocurrencyDataResponse = {
      success: true,
      result: strongCryptocurrencyDataObj,
    };
    return strongCryptocurrencyData;
  } catch (error) {
    console.error("Error in getStrongCryptocurrencyData!");
    console.error(error);
    const failedFetch: CryptocurrencyDataResponse = {
      result: null,
      success: false,
    };
    return failedFetch;
  }
};
