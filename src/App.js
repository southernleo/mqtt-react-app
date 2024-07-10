import kendoka from "./kendoka.svg";
import "./App.scss";
import React, { useState, Fragment, useEffect } from "react";

import CustomChart from "./components/CustomChart";
import { CircularGauge } from "@progress/kendo-react-gauges";

var mqtt = require("mqtt");

function App() {
  const [gauge1Value, setGauge1Value] = useState(50);
  const [gauge2Value, setGauge2Value] = useState(50);

  const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);
  const host = "ws://192.168.0.108:1884/mqtt";
  const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
  };

  useEffect(() => {
    console.log("Connecting mqtt client");
    const client = mqtt.connect(host);

    client.on("error", (err) => {
      console.log("Connection error: ", err);
      client.end();
    });
    client.on("reconnect", () => {
      console.log("Reconnecting...");
    });

    client.on("connect", () => {
      console.log(`Client connected: ${clientId}`);
      // Subscribe
      client.subscribe("stajyer/gauge1", { qos: 0 });
      client.subscribe("stajyer/gauge2", { qos: 0 });
    });
    client.on("message", (topic, message, packet) => {
      const jsonObject = JSON.parse(message.toString());
      const dateObject = new Date(jsonObject.Date);
      const day = dateObject.getDay();

      if (topic === "stajyer/gauge1") {
        setGauge1Value(jsonObject.Data);
        // populateChartData(day, jsonObject.Data);
      } else {
        setGauge2Value(jsonObject.Data);
        // populateChartData(day, jsonObject.Data);
      }
      console.log(`Received Message: ${message.toString()} On topic: ${topic}`);
    });
  }, []);

  const colors = [
    {
      to: 25,
      color: "#0058e9",
    },
    {
      from: 25,
      to: 50,
      color: "#37b400",
    },
    {
      from: 50,
      to: 75,
      color: "#ffc000",
    },
    {
      from: 75,
      color: "#f31700",
    },
  ];

  const arcOptions1 = {
    value: gauge1Value,
    colors,
  };

  const arcOptions2 = {
    value: gauge2Value,
    colors,
  };

  const centerRenderer1 = (value, color) => {
    return (
      <h3
        style={{
          color: color,
        }}
      >
        {gauge1Value}%
      </h3>
    );
  };

  const centerRenderer2 = (value, color) => {
    return (
      <h3
        style={{
          color: color,
        }}
      >
        {gauge2Value}%
      </h3>
    );
  };
  return (
    <div>
      <CircularGauge {...arcOptions1} centerRender={centerRenderer1} />;
      <CircularGauge {...arcOptions2} centerRender={centerRenderer2} />;
      <CustomChart />
    </div>
  );
}

export default App;
