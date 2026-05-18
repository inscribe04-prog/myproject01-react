import schema from "../schema";
import api from "../api";

const columns = [
  { label: "ID", key: "id" },
  ...Object.values(schema.fields).map((f) => ({ label: f.label, key: f.db }))
];

const ITEMS_PER_PAGE = 3;

function EntriesTable({ entries, currentPage, onPageChange, onEdit, onDelete }) {
  const totalPages = Math.ceil(entries.length / ITEMS_PER_PAGE);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = entries.slice(start, start + ITEMS_PER_PAGE);

  if (entries.length === 0) {
    return <p className="text-muted">No entries found.</p>;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead className="table-light">
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
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
                    onClick={() => onDelete(row.id)}
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