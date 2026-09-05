// This file stands in for the database (Supabase) for now.
// Once the backend is wired up, these arrays get replaced by real queries,
// but the shape (fields) will stay the same.

const MACHINES = [
  { id: "m1", name: "RELAY-WEB-01", agentVersion: "0.1.0", status: "online", lastCheckIn: "2 min ago" },
  { id: "m2", name: "RELAY-DB-01", agentVersion: "0.1.0", status: "online", lastCheckIn: "1 min ago" },
  { id: "m3", name: "RELAY-APP-02", agentVersion: "0.0.9", status: "offline", lastCheckIn: "3 hr ago" },
];

const OPERATIONS = [
  {
    id: "op1",
    name: "Restart service",
    description: "Restarts a named Windows/Linux service",
    params: [{ key: "serviceName", label: "Service name", placeholder: "e.g. nginx" }],
    roles: ["admin", "user"],
  },
  {
    id: "op2",
    name: "Run health check",
    description: "Runs a basic CPU/memory/disk report",
    params: [],
    roles: ["admin", "user"],
  },
  {
    id: "op3",
    name: "Pull latest log file",
    description: "Fetches the most recent application log",
    params: [{ key: "logPath", label: "Log path", placeholder: "e.g. /var/log/app.log" }],
    roles: ["admin", "user"],
  },
  {
    id: "op4",
    name: "Clear temp files",
    description: "Removes files from the temp directory",
    params: [],
    roles: ["admin"],
  },
];

// seed job history so the app doesn't look empty on first load
let JOBS = [
  { id: "j1001", machineId: "m1", operationId: "op2", status: "completed", result: "CPU 12%, Mem 44%, Disk 61%", requested: "9:02 AM", completed: "9:02 AM" },
  { id: "j1000", machineId: "m2", operationId: "op1", status: "completed", result: "Service 'postgres' restarted", requested: "8:47 AM", completed: "8:47 AM" },
  { id: "j999", machineId: "m1", operationId: "op3", status: "failed", result: "Path not found: /var/log/old.log", requested: "8:30 AM", completed: "8:30 AM" },
  { id: "j998", machineId: "m3", operationId: "op2", status: "failed", result: "Agent offline", requested: "Yesterday", completed: "Yesterday" },
];

let jobCounter = 1002;
