import { useState, useEffect, useMemo } from "react";
import { useEntryForm } from "../hooks/useEntryForm";
import schema from "../schema";
import api from "../api";

const initialForm = Object.keys(schema.fields).reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {});

function EditModal({ row, onClose, onSuccess }) {
  // 1. Single Hook Source
  const { form, setForm, errors, handleChange, isValid } = useEntryForm(initialForm);
  const [saveError, setSaveError] = useState("");
  const [originalFormState, setOriginalFormState] = useState(initialForm);

  // 2. Load data into form and save original snapshot
  useEffect(() => {
    if (!row) return;
    const populated = Object.keys(schema.fields).reduce((acc, key) => {
      const field = schema.fields[key];
      acc[key] = String(row[field.db] ?? "");
      return acc;
    }, {});
    
    setForm(populated);
    setOriginalFormState(populated); 
  }, [row, setForm]);

  // 3. Dirty check (Uses 'form' and 'originalFormState')
  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(originalFormState);
  },[form, originalFormState]);

  // 4. Handle Close with confirmation
  const handleClose = () => {
    if (isDirty) {
      const confirmDiscard = window.confirm("You have unsaved changes. Are you sure you want to discard them?");
      if (!confirmDiscard) return;
    }
    onClose();
  };

  // 5. Save Logic
  async function handleSave() {
    if (!isValid) return;

    const apiData = Object.entries(schema.fields).reduce((acc, [key, field]) => {
      acc[field.name] = form[key];
      return acc;
    }, {});

    const ok = await api.update(row.id, apiData);
    if (ok) { 
      setSaveError("");
      onSuccess();
      onClose();
    } else {
      setSaveError("❌ Update failed. Please try again.");
    }
  }

  // --- UI Logic Helpers ---
  const isMinor = Number(form.age) > 0 && Number(form.age) < 18;
  const isMarried = form.relstatus === "married";

  function field(key) {
    const f = schema.fields[key];
    const error = errors[key];
    return (
      <>
        <label className="form-label">{f.label}</label>
        {f.kind === "select" ? (
          <select
            name={key}
            className={`form-select ${error ? "is-invalid" : ""}`}
            value={form[key] || ""}
            onChange={handleChange}
          >
            <option value="notdisclose">Not Disclosing</option>
            <option value="unmarried">Unmarried</option>
            <option value="married">Married</option>
            <option value="separated">Separated</option>
          </select>
        ) : (
          <input
            name={key}
            type={f.kind === "password" ? "password" : f.kind === "email" ? "email" : "text"}
            className={`form-control ${error ? "is-invalid" : ""}`}
            value={form[key] || ""}
            onChange={handleChange}
          />
        )}
        {error && <div className="invalid-feedback">{error}</div>}
      </>
    );
  }

  if (!row) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Entry</h5>
            <button className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">{field("firstname")}</div>
              <div className="col-md-6">{field("lastname")}</div>
            </div>
            <div className="mb-3">{field("asin")}</div>
            <div className="row mb-3">
              <div className="col-md-6">{field("password")}</div>
              <div className="col-md-6">{field("email")}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">{field("phone")}</div>
              <div className="col-md-6">{field("quantity")}</div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">{field("age")}</div>
              {isMinor && <div className="col-md-6">{field("guardian")}</div>}
            </div>
            <div className="row mb-3">
              <div className="col-md-6">{field("relstatus")}</div>
              {isMarried && <div className="col-md-6">{field("spouse")}</div>}
            </div>
          </div>
          {saveError && <div className="alert alert-danger mx-3">{saveError}</div>}
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleClose}>Close</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={!isValid}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;