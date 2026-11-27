import { useDispatch, useSelector } from "react-redux";
import { acknowledgeFault, clearAcknowledgeError } from "../store/machineSlice";
import StatusBadge from "./StatusBadge";

function MachineDetail({ machineId, onClose }) {
  const dispatch = useDispatch();

  const machine = useSelector((state) =>
    state.machines.items.find((m) => m.id === machineId),
  );
  const acknowledgingId = useSelector(
    (state) => state.machines.acknowledgingId,
  );
  const acknowledgeError = useSelector(
    (state) => state.machines.acknowledgeError,
  );

  if (!machine) return null;

  const isAcknowledging = acknowledgingId === machine.id;

  function handleClose() {
    dispatch(clearAcknowledgeError());
    onClose();
  }

  return (
    <div className="panel-overlay" onClick={handleClose}>
      {/* stopPropagation: clicking inside the panel should not close it */}
      <aside className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <div className="panel-header">
          <div>
            <span className="panel-id">{machine.id}</span>
            <h2>{machine.name}</h2>
          </div>
          <button type="button" className="close-button" onClick={handleClose}>
            ✕
          </button>
        </div>

        <StatusBadge status={machine.status} />

        <div className="panel-readings">
          <div className="reading-box">
            <span className="reading-label">Temperature</span>
            <span className="reading-value">{machine.temperature} °C</span>
          </div>
          <div className="reading-box">
            <span className="reading-label">Vibration</span>
            <span className="reading-value">{machine.vibration} mm/s</span>
          </div>
        </div>

        <dl className="detail-list">
          <dt>Machine ID</dt>
          <dd>{machine.id}</dd>
          <dt>Status</dt>
          <dd className="capitalize">{machine.status}</dd>
          <dt>Last Updated</dt>
          <dd>{new Date(machine.lastUpdated).toLocaleString()}</dd>
        </dl>

        {machine.status === "fault" && (
          <button
            type="button"
            className="ack-button"
            onClick={() => dispatch(acknowledgeFault(machine.id))}
            disabled={isAcknowledging}
          >
            {isAcknowledging ? "Acknowledging..." : "Acknowledge Fault"}
          </button>
        )}

        {acknowledgeError && <p className="error-text">{acknowledgeError}</p>}
      </aside>
    </div>
  );
}

export default MachineDetail;
