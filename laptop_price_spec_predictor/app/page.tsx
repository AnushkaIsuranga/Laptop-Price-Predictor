"use client";

import React, { useState } from "react";
import { predictSpecScore, predictPrice } from "./api";
import gpuMappingRaw from "../data/label_mappings.json";
type LabelMappings = { gpu: Record<string, number> };
const gpuMapping: Record<string, number> =
  ((gpuMappingRaw as unknown as LabelMappings)?.gpu) ?? {};
import { Laptop, TrendingUp, DollarSign, Cpu, HardDrive, Monitor } from "lucide-react";
interface FeatureInputProps {
  activeTab: "spec" | "price";
  onPredict: (features: number[]) => void;
}

function FeatureInputs({ activeTab, onPredict }: Readonly<FeatureInputProps>) {
  const rawMapping = gpuMapping;
  const gpuKeys = Object.keys(rawMapping);
  const [gpu, setGpu] = useState<string>(() => gpuKeys[0] ?? "");
  const [screenSize, setScreenSize] = useState(15.6);
  const [ram, setRam] = useState(8);
  const [threads, setThreads] = useState(4);
  const [cores, setCores] = useState(4);

  const handlePredictClick = () => {
    const gpuEncoded = Number(rawMapping[gpu] ?? 0);
    if (activeTab === "spec") {
      const features = [gpuEncoded, screenSize, threads, ram, cores];
      onPredict(features);
    } else {
      const features = [gpuEncoded, threads, ram, cores];
      onPredict(features);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="gpu-select" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Cpu className="w-4 h-4 text-blue-600" />
            GPU Model
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            id="gpu-select"
            value={gpu}
            onChange={(e) => setGpu(e.target.value)}
          >
            {gpuKeys.length === 0 ? (
              <option value="" disabled>
                No GPUs available
              </option>
            ) : (
              gpuKeys.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))
            )}
          </select>
        </div>

        {activeTab === "spec" && (
          <div className="space-y-2">
            <label htmlFor="screen-input" className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Monitor className="w-4 h-4 text-blue-600" />
              Screen Size (inches)
            </label>
            <input
              type="number"
              id="screen-input"
              value={screenSize}
              step="0.1"
              onChange={(e) => setScreenSize(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="ram-input" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <HardDrive className="w-4 h-4 text-blue-600" />
            RAM (GB)
          </label>
          <input
            type="number"
            id="ram-input"
            value={ram}
            onChange={(e) => setRam(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="threads-input" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Cpu className="w-4 h-4 text-blue-600" />
            CPU Threads
          </label>
          <input
            type="number"
            id="threads-input"
            value={threads}
            onChange={(e) => setThreads(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="cores-input" className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Cpu className="w-4 h-4 text-blue-600" />
            CPU Cores
          </label>
          <input
            type="number"
            id="cores-input"
            value={cores}
            onChange={(e) => setCores(Number(e.target.value))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <button
        onClick={handlePredictClick}
        className="w-full mt-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-white font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        Generate Prediction
      </button>
    </div>
  );
}

function PredictorTabs() {
  const [activeTab, setActiveTab] = useState<"spec" | "price">("spec");
  const [features, setFeatures] = useState<number[] | null>(null);
  const [specScore, setSpecScore] = useState<string | null>(null);
  const [price, setPrice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "mock" | null>(null);

  const handlePredict = async (f: number[]) => {
    setFeatures(f);
    setSpecScore(null);
    setPrice(null);
    setError(null);
    setLoading(true);

    try {
      if (activeTab === "spec") {
        const result = await predictSpecScore(f);
        setSpecScore(String(result.value));
        setSource(result.source);
      } else {
        const result = await predictPrice(f);
        setPrice(String(result.value));
        setSource(result.source);
      }
    } catch {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <Laptop className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Laptop Predictor</h2>
              <p className="text-blue-100 text-sm mt-0.5">AI-powered specifications and pricing analysis</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50 px-8">
          <div className="flex gap-2">
            <button
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all relative ${
                activeTab === "spec"
                  ? "text-blue-600 bg-white border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("spec")}
            >
              <TrendingUp className="w-4 h-4" />
              Specification Score
            </button>
            <button
              className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all relative ${
                activeTab === "price"
                  ? "text-blue-600 bg-white border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
              onClick={() => setActiveTab("price")}
            >
              <DollarSign className="w-4 h-4" />
              Price Estimation
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Pass only activeTab and onPredict (gpuMapping removed) */}
          <FeatureInputs activeTab={activeTab} onPredict={handlePredict} />

          {/* Loading State */}
          {loading && (
            <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                <p className="text-blue-900 font-medium">Analyzing specifications...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-900 font-medium">{error}</p>
            </div>
          )}

          {/* Results */}
          {!loading && !error && (specScore !== null || price !== null) && (
            <div className="mt-6 space-y-4">
              {features && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Input Features</p>
                  <p className="text-sm text-gray-700 font-mono">{features.join(" | ")}</p>
                </div>
              )}
              {source && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600">Source: {source === "api" ? "Live API" : "Mock"}</p>
                </div>
              )}
              
              {specScore !== null && (
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800 mb-1">Predicted Specification Score</p>
                      <p className="text-4xl font-bold text-green-900">{specScore}</p>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-600 opacity-50" />
                  </div>
                </div>
              )}
              
              {price !== null && (
                <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800 mb-1">Estimated Price</p>
                      <p className="text-4xl font-bold text-blue-900">${price}</p>
                    </div>
                    <DollarSign className="w-12 h-12 text-blue-600 opacity-50" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Laptop Price & Spec Predictor
          </h1>
          <p className="text-lg text-gray-600">
            Enter laptop specifications to get instant AI-powered predictions
          </p>
        </div>

        <PredictorTabs />

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Powered by machine learning algorithms trained on market data. Developed by Anushka Isuranga.</p>
        </div>
      </div>
    </div>
  );
}