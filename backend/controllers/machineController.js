const machines = require("../data/machines.json");

const VALID_STATUSES = ["running", "idle", "fault"];

// GET /api/machines
function getAllMachines(req, res) {
  res.status(200).json(machines);
}

// GET /api/machines/:id
function getMachineById(req, res) {
  const machine = machines.find((m) => m.id === req.params.id);

  if (!machine) {
    return res
      .status(404)
      .json({ error: `Machine with id '${req.params.id}' not found` });
  }

  res.status(200).json(machine);
}

// PATCH /api/machines/:id/status
function updateMachineStatus(req, res) {
  const machine = machines.find((m) => m.id === req.params.id);

  if (!machine) {
    return res
      .status(404)
      .json({ error: `Machine with id '${req.params.id}' not found` });
  }

  // req.body can be undefined if no JSON body was sent
  const status = req.body ? req.body.status : undefined;

  if (status === undefined || status === null || status === "") {
    return res.status(400).json({ error: "The 'status' field is required" });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Invalid status '${status}'. Allowed values: ${VALID_STATUSES.join(", ")}`,
    });
  }

  machine.status = status;
  machine.lastUpdated = new Date().toISOString();

  res.status(200).json(machine);
}

module.exports = {
  getAllMachines,
  getMachineById,
  updateMachineStatus,
};
