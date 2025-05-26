'use client';

import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { Dropdown } from "@/components/ui/dropdown";
import { Card } from "@/components/ui/card";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import data from "@/data/combined_data.json";
import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const countries = [...new Set(data.map(item => item.country))].sort();

function getAvailableYears(country: string): number[] {
  return [...new Set(data.filter(d => d.country === country).map(d => d.year))].sort();
}

function getCityData(country: string, year: number) {
  const filtered = data.filter(d => d.country === country && d.year === year);
  if (!filtered.length) return null;

  const labels = filtered.map(d => d.city);

  return {
    cities: filtered,
    tempChart: {
      labels,
      datasets: [
        {
          label: "Temp Anomaly (°C)",
          data: filtered.map(d => d.temp_anomaly),
          borderColor: "#ef4444",
          backgroundColor: "rgba(239, 68, 68, 0.5)",
        },
      ],
    },
    pollutantChart: {
      labels,
      datasets: [
        {
          label: "PM2.5 (µg/m³)",
          data: filtered.map(d => d.pm25),
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(14, 165, 233, 0.5)",
        },
        {
          label: "NO₂ (µg/m³)",
          data: filtered.map(d => d.no2),
          borderColor: "#10b981",
          backgroundColor: "rgba(16, 185, 129, 0.5)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "top" as const },
        title: { display: false },
      },
    },
  };
}

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("Portugal");

  const [selectedYear, setSelectedYear] = useState(() => {
    const initialYears = getAvailableYears("Portugal");
    return initialYears.includes(2017) ? 2017 : initialYears[0];
  });

  const availableYears = getAvailableYears(selectedCountry);

  const handleCountryChange = (country: string | number) => {
    const years = getAvailableYears(country as string);
    setSelectedCountry(country as string);
    setSelectedYear(years.includes(2017) ? 2017 : years[0]);
  };

  const chartData = getCityData(selectedCountry, selectedYear);

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/hero-background.jpg)' }}>
      <div className="backdrop-blur-sm bg-white dark:bg-black/80 p-6 min-h-screen">
        <h1 className="text-3xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          🌍 MADSAD - Official Statistics Systems - Climate & Air Quality Explorer
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <Dropdown
            label="Country"
            options={countries}
            value={selectedCountry}
            onChange={handleCountryChange}
          />
          <Dropdown
            label="Year"
            options={availableYears}
            value={selectedYear}
            onChange={(value) => setSelectedYear(Number(value))}
          />
        </div>

        {chartData ? (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Charts stacked */}
            <div className="flex flex-col gap-4">
              <Card className="h-[360px]">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    🌡️ Temperature Anomaly
                  </h2>
                  <div className="h-[240px]">
                    <Line data={chartData.tempChart} options={chartData.options} />
                  </div>
                </div>
              </Card>

              <Card className="h-[360px]">
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
                    🧪 PM2.5 & NO₂ Concentrations
                  </h2>
                  <div className="h-[240px]">
                    <Line data={chartData.pollutantChart} options={chartData.options} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Map - Taller */}
            <div className="h-[720px]">
              <Map data={chartData.cities} />
            </div>
          </div>
        ) : (
          <p className="text-center text-red-600 mt-6">No data available for this selection.</p>
        )}
      </div>
    </div>
  );
}
