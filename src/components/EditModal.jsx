import { useState, useEffect } from "react";
import schema from "../schema";
import validators from "../validators";
import api from "../api";

const initialForm = Object.keys(schema.fields).reduce((acc, key) => {
    acc[key] = "";
    return acc;
}, {});

function EditModal({ row, onClose, onSuccess }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");

  // when row changes, populate the form
  useEffect(() => {
    if (!row) return;
    const populated = Object.keys(schema.fields).reduce((acc, key) => {
      const field = schema.fields[key];
      acc[key] = String(row[field.db] ?? "");
      return acc;
    }, {});
    setForm(populated);
    setErrors({});
  }, [row]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSave() {
    const errs = validators.getErrors(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const apiData = Object.entries(schema.fields).reduce((acc, [key, field]) => {
      acc[field.name] = form[key];
      return acc;
    }, {});

    const ok = await api.update(row.id, apiData);
    console.log("update ok:", ok);
    if (ok) { 
      setSaveError("");
      onSuccess();
      onClose();
    } else {
      setSaveError("❌ Update failed. Please try again.");
    }
}

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
            value={form[key]}
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
            value={form[key]}
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
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Row 1 — First Name + Last Name */}
            <div className="row mb-3">
              <div className="col-md-6">{field("firstname")}</div>
              <div className="col-md-6">{field("lastname")}</div>
            </div>

            {/* ASIN full width */}
            <div className="mb-3">{field("asin")}</div>

            {/* Row 2 — Password + Email */}
            <div className="row mb-3">
              <div className="col-md-6">{field("password")}</div>
              <div className="col-md-6">{field("email")}</div>
            </div>

            {/* Row 3 — Phone + Quantity */}
            <div className="row mb-3">
              <div className="col-md-6">{field("phone")}</div>
              <div className="col-md-6">{field("quantity")}</div>
            </div>

            {/* Row 4 — Age + Guardian (conditional) */}
            <div className="row mb-3">
              <div className="col-md-6">{field("age")}</div>
              {isMinor && <div className="col-md-6">{field("guardian")}</div>}
            </div>

            {/* Row 5 — Relationship Status + Spouse (conditional) */}
            <div className="row mb-3">
              <div className="col-md-6">{field("relstatus")}</div>
              {isMarried && <div className="col-md-6">{field("spouse")}</div>}
            </div>
          </div>

          {saveError && (
            <div className="alert alert-danger mx-3">{saveError}</div>
          )}

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
            <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditModal;