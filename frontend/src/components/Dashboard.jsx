import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMachines } from "../store/machineSlice";
import SummaryCards from "./SummaryCards";
import FilterBar from "./FilterBar";
import MachineCard from "./MachineCard";
import MachineDetail from "./MachineDetail";

function Dashboard() {
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.machines);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    dispatch(fetchMachines());
  }, [dispatch]);

  const filteredMachines = items.filter((machine) => {
    const matchesStatus =
      statusFilter === "all" || machine.status === statusFilter;
    const matchesSearch = machine.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <h1>Machine Monitoring Dashboard</h1>
          <p>Factory floor overview — select a machine to see details</p>
        </div>
      </header>

      <main className="dashboard">
        {loading && <p className="info-text">Loading machines...</p>}

        {error && (
          <div className="error-box">
            <p>Could not load machines: {error}</p>
            <button type="button" onClick={() => dispatch(fetchMachines())}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <SummaryCards machines={items} />

            <FilterBar
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
            />

            {filteredMachines.length === 0 ? (
              <p className="info-text">No machines match your search.</p>
            ) : (
              <div className="machine-grid">
                {filteredMachines.map((machine) => (
                  <MachineCard
                    key={machine.id}
                    machine={machine}
                    onSelect={setSelectedId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {selectedId && (
        <MachineDetail
          machineId={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}

export default Dashboard;
