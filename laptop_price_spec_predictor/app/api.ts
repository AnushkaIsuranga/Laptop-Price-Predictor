import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";

const client = axios.create({
  baseURL: API_BASE,
  timeout: 2000,
});

export async function predictSpecScore(features: number[]): Promise<{ value: number; source: "api" | "mock" }> {
  try {
    const res = await client.post("/predict/spec_score", { features });
    const value = Number(res.data?.spec_score);
    if (Number.isFinite(value)) return { value, source: "api" };
    throw new Error("Invalid response from API");
  } catch {
    return { value: Number((Math.random() * 40 + 60).toFixed(1)), source: "mock" };
  }
}

export async function predictPrice(features: number[]): Promise<{ value: number; source: "api" | "mock" }> {
  try {
    const res = await client.post("/predict/price", { features });
    const value = Number(res.data?.price);
    if (Number.isFinite(value)) return { value, source: "api" };
    throw new Error("Invalid response from API");
  } catch {
    return { value: Number((Math.random() * 1500 + 500).toFixed(2)), source: "mock" };
  }
}
