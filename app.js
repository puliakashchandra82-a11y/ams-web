// ---------- helpers ----------
function machineName(id) {
  const m = MACHINES.find(m => m.id === id);
  return m ? m.name : id;
}
function operationName(id) {
  const o = OPERATIONS.find(o => o.id === id);
  return o ? o.name : id;
}
function statusPill(status) {
  return `<span class="status ${status}">${status}</span>`;
}

// ---------- view switching ----------
const titles = {
  dashboard: ["Dashboard", "Overview of registered machines and recent activity"],
  run: ["Run Operation", "Request an operation on a target machine"],
  jobs: ["Jobs", "Live status of active and recently requested jobs"],
  history: ["History", "Full record of past operations"],
  admin: ["Admin", "Manage machines and the operation catalog"],
};

document.querySelectorAll(".nav-item").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    document.querySelectorAll(".view").forEach(v => v.classList.add("hidden"));
    document.getElementById(`view-${view}`).classList.remove("hidden");
    document.getElementById("view-title").textContent = titles[view][0];
    document.getElementById("view-subtitle").textContent = titles[view][1];
    if (view === "jobs") renderJobsTable();
    if (view === "history") renderHistoryTable();
    if (view === "admin") renderAdmin();
  });
});

// ---------- dashboard ----------
function renderMachineGrid() {
  const grid = document.getElementById("machine-grid");
  grid.innerHTML = MACHINES.map(m => `
    <div class="machine-card">
      <div class="machine-card-head">
        <strong>${m.name}</strong>
        <span class="dot ${m.status}"></span>
      </div>
      <div class="machine-meta">Agent <span class="mono">v${m.agentVersion}</span></div>
      <div class="machine-meta">Last check-in: ${m.lastCheckIn}</div>
    </div>
  `).join("");
}

function renderRecentJobs() {
  const tbody = document.querySelector("#recent-jobs-table tbody");
  const recent = JOBS.slice(0, 5);
  tbody.innerHTML = recent.map(j => `
    <tr>
      <td>${machineName(j.machineId)}</td>
      <td>${operationName(j.operationId)}</td>
      <td>${statusPill(j.status)}</td>
      <td class="mono">${j.requested}</td>
    </tr>
  `).join("");
}

// ---------- run operation ----------
const selectMachine = document.getElementById("select-machine");
const selectOperation = document.getElementById("select-operation");
const paramFields = document.getElementById("param-fields");

selectMachine.innerHTML = MACHINES.map(m => `<option value="${m.id}">${m.name}</option>`).join("");
selectOperation.innerHTML = OPERATIONS.map(o => `<option value="${o.id}">${o.name}</option>`).join("");

function renderParamFields() {
  const op = OPERATIONS.find(o => o.id === selectOperation.value);
  paramFields.innerHTML = op.params.map(p => `
    <label>${p.label}
      <input type="text" data-key="${p.key}" placeholder="${p.placeholder}" />
    </label>
  `).join("");
}
selectOperation.addEventListener("change", renderParamFields);
renderParamFields();

document.getElementById("run-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const machineId = selectMachine.value;
  const operationId = selectOperation.value;
  const machine = MACHINES.find(m => m.id === machineId);

  const feedback = document.getElementById("run-feedback");

  if (machine.status === "offline") {
    feedback.textContent = `Cannot dispatch: ${machine.name} is offline.`;
    return;
  }

  const newJob = {
    id: "j" + (jobCounter++),
    machineId,
    operationId,
    status: "pending",
    result: null,
    requested: "just now",
    completed: null,
  };
  JOBS.unshift(newJob);
  feedback.textContent = `Job ${newJob.id} created — dispatched to ${machine.name}.`;

  renderRecentJobs();
  renderJobsTable();

  // simulate the agent picking up the job and completing it
  setTimeout(() => {
    newJob.status = "running";
    renderRecentJobs();
    renderJobsTable();
  }, 1200);

  setTimeout(() => {
    const willFail = Math.random() < 0.15;
    newJob.status = willFail ? "failed" : "completed";
    newJob.result = willFail ? "Agent reported a non-zero exit code" : "Operation completed successfully";
    newJob.completed = "just now";
    renderRecentJobs();
    renderJobsTable();
    renderHistoryTable();
  }, 3200);
});

// ---------- jobs table ----------
function renderJobsTable() {
  const tbody = document.querySelector("#jobs-table tbody");
  tbody.innerHTML = JOBS.map(j => `
    <tr>
      <td class="mono">${j.id}</td>
      <td>${machineName(j.machineId)}</td>
      <td>${operationName(j.operationId)}</td>
      <td>${statusPill(j.status)}</td>
      <td>${j.result || "—"}</td>
      <td class="mono">${j.requested}</td>
    </tr>
  `).join("");
}

// ---------- history ----------
function renderHistoryTable(filter = "") {
  const tbody = document.querySelector("#history-table tbody");
  const done = JOBS.filter(j => j.status === "completed" || j.status === "failed");
  const f = filter.toLowerCase();
  const filtered = done.filter(j =>
    machineName(j.machineId).toLowerCase().includes(f) ||
    operationName(j.operationId).toLowerCase().includes(f)
  );
  tbody.innerHTML = filtered.map(j => `
    <tr>
      <td class="mono">${j.id}</td>
      <td>${machineName(j.machineId)}</td>
      <td>${operationName(j.operationId)}</td>
      <td>${statusPill(j.status)}</td>
      <td class="mono">${j.completed || "—"}</td>
    </tr>
  `).join("");
}
document.getElementById("history-search").addEventListener("input", (e) => {
  renderHistoryTable(e.target.value);
});

// ---------- admin ----------
function renderAdmin() {
  document.querySelector("#admin-machines-table tbody").innerHTML = MACHINES.map(m => `
    <tr>
      <td>${m.name}</td>
      <td class="mono">v${m.agentVersion}</td>
      <td>${statusPill(m.status === "online" ? "completed" : "failed")}</td>
      <td class="mono">${m.lastCheckIn}</td>
    </tr>
  `).join("");

  document.querySelector("#admin-ops-table tbody").innerHTML = OPERATIONS.map(o => `
    <tr>
      <td>${o.name}</td>
      <td class="mono">${o.params.map(p => p.key).join(", ") || "none"}</td>
      <td>${o.roles.join(", ")}</td>
    </tr>
  `).join("");
}

// ---------- initial render ----------
renderMachineGrid();
renderRecentJobs();
