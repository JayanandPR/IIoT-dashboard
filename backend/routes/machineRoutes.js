const express = require("express");

const {
  getAllMachines,
  getMachineById,
  updateMachineStatus,
} = require("../controllers/machineController");

const router = express.Router();

router.get("/", getAllMachines);
router.get("/:id", getMachineById);
router.patch("/:id/status", updateMachineStatus);

module.exports = router;
