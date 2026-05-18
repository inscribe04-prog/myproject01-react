import { useState } from "react";
import schema from "../schema";
import validators from "../validators";
import api from "../api";


// build initial state using field KEYS not field names
const initialForm = Object.keys(schema.fields).reduce((acc, key) => {
    acc[key] = "";
    return acc;
}, {});

function EntryForm({ onSuccess }) {
//   const initialForm = Object.values(schema.fields).reduce((acc, field) => {
//     acc[field.name] = "";
//     return acc;
//   }, {});

  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState({ text: "", type: "" });
  const [counters, setCounters] = useState({});

  function handleChange(e) {
    const { name, value } = e.target;
    const field = schema.fields[name];
    setForm((prev) => ({ ...prev, [name]: value }));

    // counter logic
    // const fieldKey = Object.keys(schema.fields).find(
    //   (k) => schema.fields[k].name === name
    // );
    // const field = schema.fields[fieldKey];

    if (field?.counterId) {
      const len = value.length;
      const isDigit = field.kind === "digits";
      const unit = isDigit ? "digit" : "character";
      const plural = len >= 2 ? `${unit}s` : unit;
      setCounters((prev) => ({
        ...prev,
        [name]: {
          text: len === 0 ? "" : `${len} ${plural} entered`,
          color: len === 0 ? "gray" : len < (field.min || field.exactLength || 1) ? "red" : "green",
        },
      }));
    }

    // clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    const errs = validators.getErrors(form);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setMessage({ text: "❌ Please fix the highlighted fields.", type: "danger" });
      return;
    }

    const apiData = Object.entries(schema.fields).reduce((acc, [key , field]) =>{
        acc[field.name] = form[key];
        return acc;
    }, {});

    const ok = await api.create(apiData);
    if (ok) {
      setMessage({ text: "✅ Saved successfully!", type: "success" });
      setForm(initialForm);
      setCounters({});
      setErrors({});
      onSuccess();
    } else {
      setMessage({ text: "❌ Save failed.", type: "danger" });
    }
  }

  const isMinor = Number(form.age) > 0 && Number(form.age) < 18;
  const isMarried = form.relstatus === "married";

  function renderField(key) {
    const field = schema.fields[key];
    const counter = counters[key];
    const error = errors[key];

    return (
      <div className="row mb-3">
      <div className="col-6" key={key}>
        <label className="form-label">{field.label}</label>
        {field.kind === "select" ? (
          <select
            name={key}
            className={`form-select ${error ? "is-invalid" : ""}`}
            value={form[key]}
            onChange={handleChange}
          >
            {/* <option value="">Choose...</option> */}
            <option value="notdisclose">Not Disclosing</option>
            <option value="unmarried">Unmarried</option>
            <option value="married">Married</option>
            <option value="seperated">Seperated</option>
          </select>
        ) : (
          <input
            name={key}
            type={field.kind === "password" ? "password" : field.kind === "email" ? "email" : "text"}
            className={`form-control ${error ? "is-invalid" : ""}`}
            value={form[key]}
            onChange={handleChange}
            maxLength={field.maxLength}
          />
        )}
        {counter && (
          <small style={{ color: counter.color }}>{counter.text}</small>
        )}
        {error && <div className="invalid-feedback">{error}</div>}
      </div>
      </div>
    );
  }

  return (
    <div className="card shadow mb-4">
    <div className="card-body p-4">
      <h5 className="mb-3">React Form Implementation</h5>
      <form onSubmit={handleSubmit}>
        <div className="row-md-12">
          {renderField("firstname")}
          {renderField("lastname")}
          {renderField("asin")}
          {renderField("password")}
          {renderField("email")}
          {renderField("phone")}
          {renderField("quantity")}
          {/* <div className="col-md-6"> */}
          {/* <div class="row mb-3"> */}
          {renderField("age")}
          <div className="col mb-3">
          {isMinor && renderField("guardian")}
          </div>
          {renderField("relstatus")}
          <div className="row mb-3"></div>
          {isMarried && renderField("spouse")}
          </div>
          {message.text && (
        <div className={`alert alert-${message.type}`}>{message.text}</div>
      )}
          <button type="submit" className="btn btn-primary">
          Save Entry
        </button>
      </form>
      </div>
    </div>
  );
}

export default EntryForm;