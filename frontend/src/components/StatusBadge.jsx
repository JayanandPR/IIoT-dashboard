function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span className="status-dot" />
      {status}
    </span>
  );
}

export default StatusBadge;
