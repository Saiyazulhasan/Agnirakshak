export function getHazardStatus(data) {
  if (!data) {
    return {
      level: "OFFLINE",
      label: "NO DATA",
      color: "slate",
    };
  }

  if (data.flame === true) {
    return {
      level: "CONFIRMED",
      label: "FIRE DETECTED",
      color: "red",
    };
  }

  if (data.smoke >= 500 || data.temperature >= 50) {
    return {
      level: "SUSPECTED",
      label: "POSSIBLE HAZARD",
      color: "yellow",
    };
  }

  return {
    level: "NORMAL",
    label: "SAFE",
    color: "green",
  };
}