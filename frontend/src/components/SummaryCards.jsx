function SummaryCards({ machines }) {
  const running = machines.filter((m) => m.status === "running").length;
  const idle = machines.filter((m) => m.status === "idle").length;
  const fault = machines.filter((m) => m.status === "fault").length;

  return (
    <div className="summary-cards">
      <div className="summary-card">
        <span className="summary-label">Total Machines</span>
        <span className="summary-value">{machines.length}</span>
      </div>
      <div className="summary-card summary-running">
        <span className="summary-label">Running</span>
        <span className="summary-value">{running}</span>
      </div>
      <div className="summary-card summary-idle">
        <span className="summary-label">Idle</span>
        <span className="summary-value">{idle}</span>
      </div>
      <div className="summary-card summary-fault">
        <span className="summary-label">Fault</span>
        <span className="summary-value">{fault}</span>
      </div>
    </div>
  );
}

export default SummaryCards;
