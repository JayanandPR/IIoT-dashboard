import StatusBadge from "./StatusBadge";

function MachineCard({ machine, onSelect }) {
  return (
    <button
      type="button"
      className={`machine-card card-${machine.status}`}
      onClick={() => onSelect(machine.id)}
    >
      <div className="card-header">
        <div>
          <span className="card-id">{machine.id}</span>
          <h3 className="card-name">{machine.name}</h3>
        </div>
        <StatusBadge status={machine.status} />
      </div>

      <div className="card-readings">
        <div className="reading-box">
          <span className="reading-label">Temp</span>
          <span className="reading-value">{machine.temperature} °C</span>
        </div>
        <div className="reading-box">
          <span className="reading-label">Vibration</span>
          <span className="reading-value">{machine.vibration} mm/s</span>
        </div>
      </div>
    </button>
  );
}

export default MachineCard;
