import { useState } from "react";

function ImportExcel({ onSuccess }) {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });
    const [loading, setLoading] = useState(false);

    function handleFileChange(e) {
        setFile(e.target.files[0]);
        setMessage({ text: "", type: "" });
    }

    async function handleUpload() {
        if (!file) { setMessage({ text: "Please select a file first", type: "danger" }); return; }

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            const res = await fetch('/api/import', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await res.json();
            if (res.ok) {
                setMessage({ text: `✅ ${data.message}`, type: "success" });
                setFile(null);
                onSuccess();
            } else {
                setMessage({ text: data.details ? data.details.join(' | ') : `❌ ${data.error}`, type: "danger" });
            }
        } catch (err) {
            setMessage({ text: "❌ Upload failed", type: "danger" });
        }
        setLoading(false);
    }

    return (
        <div className="card shadow mb-4">
            <div className="card-body p-4">
                <h5 className="mb-3">📥 Import Excel</h5>
                <p className="text-muted">Upload an Excel file (.xlsx) to bulk import entries.</p>
                <p className="text-muted small">
                    Expected column order: firstname, lastname, asin, password, email, phone, quantity, age, guardian, relstatus, spousename
                </p>

                {message.text && (
                    <div className={`alert alert-${message.type}`}>{message.text}</div>
                )}

                <div className="mb-3">
                    <input
                        type="file"
                        accept=".xlsx"
                        className="form-control"
                        onChange={handleFileChange}
                    />
                </div>

                {file && (
                    <p className="text-muted small">Selected: {file.name}</p>
                )}

                <button
                    className="btn btn-success"
                    onClick={handleUpload}
                    disabled={loading || !file}
                >
                    {loading ? 'Importing...' : 'Import'}
                </button>
            </div>
        </div>
    );
}



export default ImportExcel;
