import { useState } from "react";
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
  const [showForm, setShowForm] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
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
    await api.logout();
    setUser(null);
    navigate("/");
  }

  function handleToggleTable() {
    if (!showTable && entries.length === 0) loadEntries();
    setShowTable((prev) => !prev);
    setShowForm(false);
  }

  function handleToggleForm() {
    setShowForm((prev) => !prev);
    setShowTable(false);
  }

  const filteredEntries = entries.filter((row) =>
    `${row.firstname} ${row.lastname}`.toLowerCase().includes(search.toLowerCase())
  );

  function exportToCSV() {
    if (entries.length === 0) { alert("No data to export!"); return; }
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', color: '#212529' }}>
      
      <Navbar Navbar user={user} onLogout={handleLogout} onHome={() => {
        setShowForm(false);
        setShowTable(false);
     }}> </Navbar>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 56px)' }}>

        {/* SIDEBAR */}
        <div style={{
          width: sidebarOpen ? '220px' : '50px',
          backgroundColor: '#212529',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem 0'
        }}>
          

          {/* Toggle button */}
          <div 
            onMouseEnter={() => setSidebarOpen(true)}
            onMouseLeave={() => setSidebarOpen(false)}
            style={{
              width: sidebarOpen ? '220px' : '50px',
              backgroundColor: '#212529',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              padding: '1rem 0'
            }}
          > </div>
            
                               
          {/* Nav items */}
          <button
            onClick={handleToggleForm}
            title="Add Entry"
            style={{
              background: showForm ? 'rgba(255,255,255,0.15)' : 'none',
              border: 'none', color: 'white',
              padding: '0.75rem 1rem',
              textAlign: 'left', cursor: 'pointer',
              whiteSpace: 'nowrap', width: '100%',
              borderLeft: showForm ? '3px solid #0d6efd' : '3px solid transparent'
            }}
          >
            ➕ {sidebarOpen && 'Add Entry'}
          </button>

          <button
            onClick={handleToggleTable}
            title="Operate on Entries"
            style={{
              background: showTable ? 'rgba(255,255,255,0.15)' : 'none',
              border: 'none', color: 'white',
              padding: '0.75rem 1rem',
              textAlign: 'left', cursor: 'pointer',
              whiteSpace: 'nowrap', width: '100%',
              borderLeft: showTable ? '3px solid #ffc107' : '3px solid transparent'
            }}
          >
            📋 {sidebarOpen && 'View Entries'}
          </button>

        </div>

        {/* MAIN CONTENT */}
        <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}
        onClick={ () => { setShowForm(false); setShowTable(false); } }
        >

          {!showForm && !showTable && (
            <div style={{ textAlign: 'center', marginTop: '4rem', color: '#6c757d' }}>
              <h4>Welcome, {user?.firstname}!</h4>
              <p>Select an option from the sidebar to get started.</p>
            </div>
          )}

          {showForm && (
            <div onClick={(e) => e.stopPropagation() }>
            <EntryForm onSuccess={() => { loadEntries(); setShowForm(false); }} />
            </div>
          )}

          {showTable && (
            <div onClick={ (e) => e.stopPropagation () }>
              <div className="d-flex justify-content-end align-items-center gap-2 mb-3">
                <input
                  type="text"
                  className="form-control form-control-sm w-auto"
                  placeholder="🔍 Search by name..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                />
                <button className="btn btn-outline-info btn-sm" onClick={exportToCSV}>
                  Export CSV
                </button>
              </div>

              <EntriesTable
                entries={filteredEntries}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onEdit={setEditRow}
                onDelete={handleDelete}
              />
            </div>
          )}

          <EditModal
            row={editRow}
            onClose={() => setEditRow(null)}
            onSuccess={loadEntries}
          />

        </div>
      </div>
    </div>
  );
}

export default FormPage;