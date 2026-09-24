import { useEffect, useState } from "react";
import { connectWebSocket } from "../services/websocket";

export function useTelemetry() {
  const [telemetry, setTelemetry] = useState({});

  useEffect(() => {
    const socket = connectWebSocket((message) => {
      if (message.type !== "telemetry") {
        return;
      }

      const data = message.data;

      setTelemetry((current) => ({
        ...current,
        [data.nodeId]: data,
      }));
    });

    return () => {
      socket.close();
    };
  }, []);

  return telemetry;
}