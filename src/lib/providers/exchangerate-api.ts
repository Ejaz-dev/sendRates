import axios from "axios";

const BASE_URL = "https://v6.exchangerate-api.com/v6";

export async function getMidMarketRate(
  source: string,
  target: string
): Promise<number | null> {
  try {
    const response = await axios.get(
      `${BASE_URL}/${process.env.EXCHANGERATE_API_KEY}/pair/${source}/${target}`
    );
    if (response.data.result === "success") {
      return response.data.conversion_rate;
    }
    return null;
  } catch (error) {
    console.error("ExchangeRate-API error:", error);
    return null;
  }
}