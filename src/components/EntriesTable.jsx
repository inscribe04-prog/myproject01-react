import { useState, useMemo } from "react";
import schema from "../schema";
import api from "../api";
import { toast } from 'react-toastify';


const columns = [
  { label: "ID", key: "id" },
  ...Object.values(schema.fields).map((f) => ({ label: f.label, key: f.db }))
];

const ITEMS_PER_PAGE = 11;

const ConfirmDeleteToast = ({ closeToast, onConfirm }) => (
  <div>
    <p>Are you sure you want to delete?</p>
    <div className="d-flex gap-2">
      <button 
        className="btn btn-sm btn-danger" 
        onClick={() => { onConfirm(); closeToast(); }}
      >
        Yes
      </button>
      <button 
        className="btn btn-sm btn-secondary" 
        onClick={closeToast}
      >
        No
      </button>
    </div>
  </div>
);




function EntriesTable({ entries, currentPage, onPageChange, onEdit, onDelete }) {
  
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');
  const [searchTerm, setSearchTerm] = useState("");

  
  // 2. Logic Pipeline: Filter -> Sort
  const processedEntries = useMemo(() => {
    // A. Filter
    let data = [...entries];
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      data = data.filter(row => 
        Object.values(row).some(val => String(val ?? '').toLowerCase().includes(lower))
      );
    }

    // B. Sort
  if (sortKey) {
    // We use Intl.Collator for "Human" sorting
    const collator = new Intl.Collator(undefined, { 
      numeric: true, 
      sensitivity: 'base' 
    });

    data.sort((a, b) => {
      const rawA = a[sortKey];
      const rawB = b[sortKey];

      // 2. Safely convert to string only if they exist
    const valA = (rawA !== null && rawA !== undefined) ? String(rawA).trim() : '';
    const valB = (rawB !== null && rawB !== undefined) ? String(rawB).trim() : '';

      if (valA === '' && valB !== '') return 1;
      if (valB === '' && valA !== '') return -1;
      if (valA === '' && valB === '') return 0;
      
      const comparison = collator.compare(valA, valB);
    
      return sortDir === 'asc' ? comparison : -comparison;
      });
    }  
    return data;
  }, [entries, searchTerm, sortKey, sortDir]);

  // 3. Pagination derived from processed entries
  const totalPages = Math.ceil(processedEntries.length / ITEMS_PER_PAGE) || 1;
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = processedEntries.slice(start, start + ITEMS_PER_PAGE);

  // Helper to handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    onPageChange(1); // Reset to page 1 when searching
  };

  if (entries.length === 0) return <p className="text-muted">No entries found.</p>;

  return (
    <>


    {/* Search Input */}
      <div className="mb-3">
        <input 
          type="text" 
          className="form-control" 
          placeholder="🔍 Search all fields..." 
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

    <div className="d-flex justify-content-between align-items-center mb-2">
      <small className="text-muted">
        Showing {processedEntries.length > 0 ? start + 1 : 0} – {Math.min(start + 
          ITEMS_PER_PAGE, processedEntries.length)} of {processedEntries.length} entries          
      </small>
    </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key} onClick={() => {

                  if (sortKey === col.key) setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
                  else { setSortKey(col.key); setSortDir('asc'); }
                  }} style={{ cursor: 'pointer', userSelect: 'none' }}>
                  {col.label} {sortKey === col.key ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}

                </th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((row) => (
              <tr key={row.id}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key] ?? ""}</td>
                ))}
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    onClick={() => onEdit(row)}
                  >
                    Edit
                  </button>

                  
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => {
                      // We trigger the toast, passing the onDelete function to it
                      toast.warn(
                        <ConfirmDeleteToast onConfirm={() => onDelete(row.id)} />, 
                        { autoClose: false, closeOnClick: false }
                      );
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      {/* Pagination */}
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
              Previous
            </button>
          </li>
          <li className="page-item disabled">
            <span className="page-link">
              Page {currentPage} of {totalPages || 1}
            </span>
          </li>
          <li className={`page-item ${currentPage >= totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default EntriesTable;