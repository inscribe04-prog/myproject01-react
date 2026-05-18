import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import EntryForm from "../components/EntryForm";
import EntriesTable from "../components/EntriesTable";
import EditModal from "../components/EditModal";
import api from "../api";
import schema from "../schema";


function FormPage({ user, setUser }) {
  const [entries, setEntries] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editRow, setEditRow] = useState(null);
  const navigate = useNavigate();

  async function loadEntries() {
    const data = await api.getEntries();
    setEntries(data);
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure?")) return;
    await api.delete(id);
    await loadEntries();
  }

  async function handleLogout() {
    
    const BASE = import.meta.env.VITE_API_URL || '';
    await fetch(`${BASE}/logout`);
    setUser(null);
    navigate("/");
  }

  function handleToggleTable() {
    if (!showTable && entries.length === 0) loadEntries();
    setShowTable((prev) => !prev);
  }

  const filteredEntries = entries.filter((row) =>
    `${row.firstname} ${row.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  function exportToCSV() {
    if (entries.length === 0) {
        alert("No data to export!");
        return;
    }

    const columns = [
        { label: "ID", key: "id" },
        ...Object.values(schema.fields).map((f) => ({ label: f.label, key: f.db }))
    ];

    const headers = columns.map((col) => col.label);
    const csvRows = [headers.join(",")];

    for (const row of entries) {
        const values = columns.map((col) => {
            const escaped = String(row[col.key] ?? "").replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "entries_export.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
      <div className="container py-4">

        <EntryForm onSuccess={loadEntries} />

        <h5>Form entries from database:</h5>
        <p>Click the button below to view them</p>

        <div className="mb-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Search entries by name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <button
          className="btn btn-outline-warning w-100 mt-2"
          onClick={handleToggleTable}
        >
          {showTable ? "Hide Table" : "Show Table of Entries"}
        </button>

        <button
          className="btn btn-outline-info w-100 mt-2"
          onClick={exportToCSV}
      >
    Export to CSV
</button>

        {showTable && (
          <EntriesTable
            entries={filteredEntries}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onEdit={setEditRow}
            onDelete={handleDelete}
          />
        )}

        <EditModal
          row={editRow}
          onClose={() => setEditRow(null)}
          onSuccess={loadEntries}
        />

      </div>
    </div>
  );
}

export default FormPage;