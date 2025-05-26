"use client";

import { MapContainer, TileLayer, Circle, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression } from "leaflet"; // ✅ importação do tipo correto

type City = {
  city: string;
  lat: number;
  lon: number;
  temp_anomaly: number;
  pm25: number;
};

export default function Map({ data }: { data: City[] }) {
  console.log("📍 Cidades recebidas no mapa:", data);

  // Detectar e mostrar dados inválidos na consola
  const invalidCities = data.filter(
    city =>
      typeof city.lat !== "number" ||
      typeof city.lon !== "number" ||
      typeof city.temp_anomaly !== "number"
  );

  if (invalidCities.length > 0) {
    console.warn("⚠️ Cidades com coordenadas ou temperatura inválidas:", invalidCities);
  }

  // ✅ Centro do mapa com tipo explícito para evitar erro no build
  const mapCenter: [number, number] = [20, 0];

  return (
    <MapContainer
      center={[20, 0] as [number, number]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: 400, width: "100%" }}
    >

      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {data
        .filter(
          city =>
            typeof city.lat === "number" &&
            typeof city.lon === "number" &&
            typeof city.temp_anomaly === "number"
        )
        .map((city, idx) => (
          <Circle
            key={idx}
            center={[city.lat, city.lon] as [number, number]} // ✅ também tipado corretamente
            radius={10000 + Math.abs(city.temp_anomaly) * 30000}
            pathOptions={{ color: city.temp_anomaly > 0 ? "red" : "blue" }}
          >
            <Tooltip>
              <strong>{city.city}</strong>
              <br />
              🌡️ {city.temp_anomaly.toFixed(2)} °C
              <br />
              🧪 PM2.5: {city.pm25 ?? "?"} µg/m³
            </Tooltip>
          </Circle>
        ))}
    </MapContainer>
  );
}
