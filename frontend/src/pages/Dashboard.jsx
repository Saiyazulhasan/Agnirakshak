import { useTelemetry } from "../hooks/useTelemetry";
import { getHazardStatus } from "../utils/hazard";

const nodes = ["node01", "node02", "node03"];

function NodeCard({ nodeId, data }) {
  const hasData = Boolean(data);
  const status = getHazardStatus(data);

  const statusStyles = {
    green: "bg-green-500/15 text-green-400 border-green-500/20",
    yellow: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
    red: "bg-red-500/15 text-red-400 border-red-500/20",
    slate: "bg-slate-500/15 text-slate-400 border-slate-500/20",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      {/* Node Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
            Sensor Node
          </p>

          <h2 className="mt-1 text-xl font-bold">
            {nodeId.toUpperCase()}
          </h2>
        </div>

        <span
          className={`h-3 w-3 rounded-full ${
            hasData ? "bg-green-400" : "bg-slate-600"
          }`}
        />
      </div>

      {!hasData ? (
        <div className="mt-10 rounded-xl border border-slate-800 bg-slate-950/50 p-6 text-center">
          <p className="text-slate-500">Waiting for telemetry...</p>

          <p className="mt-1 text-xs text-slate-600">
            No data received yet
          </p>
        </div>
      ) : (
        <div className="mt-6">
          {/* Hazard Status */}
          <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Hazard Status
              </p>

              <p className="mt-1 text-sm font-medium text-slate-300">
                {status.level}
              </p>
            </div>

            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                statusStyles[status.color]
              }`}
            >
              {status.label}
            </span>
          </div>

          {/* Temperature + Smoke */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-950/60 p-4">
              <p className="text-xs text-slate-500">
                Temperature
              </p>

              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {data.temperature}
                </span>

                <span className="ml-1 text-sm text-slate-500">
                  °C
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-950/60 p-4">
              <p className="text-xs text-slate-500">
                Smoke Level
              </p>

              <div className="mt-2">
                <span className="text-3xl font-bold">
                  {data.smoke}
                </span>

                <span className="ml-1 text-sm text-slate-500">
                  ppm
                </span>
              </div>
            </div>
          </div>

          {/* Flame */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-4">
            <span className="text-sm text-slate-500">
              Flame Sensor
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                data.flame
                  ? "bg-red-500/15 text-red-400"
                  : "bg-green-500/15 text-green-400"
              }`}
            >
              {data.flame ? "🔥 DETECTED" : "CLEAR"}
            </span>
          </div>

          {/* Node ID / Timestamp */}
          <div className="mt-4 flex justify-between text-xs text-slate-600">
            <span>{data.nodeId}</span>

            <span>
              {data.ts
                ? new Date(data.ts).toLocaleTimeString()
                : "--"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const telemetry = useTelemetry();

  const activeNodes = nodes.filter(
    (nodeId) => telemetry[nodeId]
  ).length;

  const fireNodes = nodes.filter(
    (nodeId) =>
      telemetry[nodeId] &&
      telemetry[nodeId].flame === true
  ).length;

  const suspectedNodes = nodes.filter((nodeId) => {
    const data = telemetry[nodeId];

    if (!data || data.flame === true) {
      return false;
    }

    return data.smoke >= 500 || data.temperature >= 50;
  }).length;

  let systemStatus = "NORMAL";
  let systemStatusColor = "text-green-400";
  let systemDotColor = "bg-green-400";

  if (fireNodes > 0) {
    systemStatus = "FIRE DETECTED";
    systemStatusColor = "text-red-400";
    systemDotColor = "bg-red-400";
  } else if (suspectedNodes > 0) {
    systemStatus = "SUSPECTED";
    systemStatusColor = "text-yellow-400";
    systemDotColor = "bg-yellow-400";
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-8 text-white md:px-10">

      {/* Header */}
      <header className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-[0.3em] text-red-400">
            AGNIRAKSHAK
          </p>

          <h1 className="mt-2 text-3xl font-bold md:text-4xl">
            Fire Evacuation & Monitoring
          </h1>

          <p className="mt-2 text-slate-400">
            Real-time building safety monitoring system
          </p>
        </div>

        {/* Connection */}
        <div className="flex w-fit items-center gap-3 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />

          <span className="text-sm font-medium text-green-400">
            LIVE CONNECTION
          </span>
        </div>
      </header>

      {/* Overview */}
      <section className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* System Status */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            System Status
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span
              className={`h-3 w-3 rounded-full ${systemDotColor}`}
            />

            <h2
              className={`text-2xl font-bold ${systemStatusColor}`}
            >
              {systemStatus}
            </h2>
          </div>
        </div>

        {/* Active Nodes */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Active Nodes
          </p>

          <h2 className="mt-2 text-3xl font-bold">
            {activeNodes}{" "}
            <span className="text-lg text-slate-600">
              / {nodes.length}
            </span>
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Receiving live telemetry
          </p>
        </div>

        {/* Alerts */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <p className="text-sm text-slate-500">
            Active Alerts
          </p>

          <div className="mt-2 flex gap-6">
            <div>
              <p className="text-2xl font-bold text-yellow-400">
                {suspectedNodes}
              </p>

              <p className="text-xs text-slate-500">
                Suspected
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-red-400">
                {fireNodes}
              </p>

              <p className="text-xs text-slate-500">
                Fire
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sensor Nodes */}
      <section>
        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Sensor Nodes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Live environmental telemetry
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {nodes.map((nodeId) => (
            <NodeCard
              key={nodeId}
              nodeId={nodeId}
              data={telemetry[nodeId]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;