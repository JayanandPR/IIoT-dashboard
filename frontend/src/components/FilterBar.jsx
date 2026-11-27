const STATUS_OPTIONS = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "idle", label: "Idle" },
  { value: "fault", label: "Fault" },
];

function FilterBar({ search, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <div className="filter-bar">
      <input
        type="text"
        className="search-input"
        placeholder="Search by machine name..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
      />

      <div className="filter-pills">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`filter-pill ${statusFilter === option.value ? "active" : ""}`}
            aria-pressed={statusFilter === option.value}
            onClick={() => onStatusChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;
