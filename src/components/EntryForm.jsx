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
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchMsg, setMatchMsg] = useState({ text: "", color: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    const field = schema.fields[name];

    // restrict spaces using schema
    if (field?.allowSpaces === false && /\s/.test(value)) return;
    // restrict digits-only fields
    if (field?.kind === 'digits') {
        if (value !== '' && !/^\d+$/.test(value)) return;
    }
      // restrict name fields
    if (field?.kind === 'name') { 
      if (value !== '' && !/^[A-Za-z]+$/.test(value)) return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));


    // live error feedback
    if (field?.min && value.length > 0 && value.length < field.min) {
        setErrors((prev) => ({ ...prev, [name]: `${field.label} should be minimum ${field.min} characters` }));
    } else if (field?.exactLength && value.length > 0 && value.length !== field.exactLength) {
        setErrors((prev) => ({ ...prev, [name]: `${field.label} must be exactly ${field.exactLength} digits` }));
    } else if (field?.max !== undefined && Number(value) > field.max) {
        setErrors((prev) => ({ ...prev, [name]: `${field.label} must be at most ${field.max}` }));
    } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    
    // counter logic
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

  function handleConfirmChange(e) {
    const val = e.target.value;
    setConfirmPassword(val);
    if (val.length === 0) {
        setMatchMsg({ text: "", color: "" });
    } else if (val === form.password) {
        setMatchMsg({ text: "✅ Passwords match", color: "green" });
    } else {
        setMatchMsg({ text: "❌ Does not match", color: "red" });
    }
}

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage({ text: "", type: "" });

    if (confirmPassword !== form.password) {   // ← first check
        setMessage({ text: "❌ Passwords do not match.", type: "danger" });
        return;
    }
    
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

    if (confirmPassword !== form.password) {
    setMessage({ text: "❌ Passwords do not match.", type: "danger" });
    return;
    }


    // if (/\s/.test(field)) {
    //     setError('First and last name cannot contain spaces');
    //     return;
    // }






  }

  const isMinor = Number(form.age) > 0 && Number(form.age) < 18;
  const isMarried = form.relstatus === "married";

  function renderField(key) {
    const field = schema.fields[key];
    const counter = counters[key];
    const error = errors[key];

    return (
      <div className="mb-3" key={key}>
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
    );
  }


  return (
    <div className="card shadow mb-4">
    <div className="card-body p-4">
      <h5 className="mb-3">React Form Implementation</h5>
      <form onSubmit={handleSubmit}>
        
        <div className="row">
        <div className="col-md-6">{renderField("firstname")}</div>
        <div className="col-md-6">{renderField("lastname")}</div>
      </div>

    {renderField("asin")}
      <div className="row">
        <div className="col-md-6">{renderField("password")}</div>
        <div className="col-md-6">
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              value={confirmPassword}
              onChange={handleConfirmChange}
            />
            {matchMsg.text && <small style={{ color: matchMsg.color }}>{matchMsg.text}</small>}
          </div>
         </div>
        </div>

      <div className="row">
        <div className="col-md-6">{renderField("email")}</div>
        <div className="col-md-6">{renderField("phone")}</div>
      </div>

      {renderField("quantity")}

      <div className="row">
        <div className="col-md-6">{renderField("age")}</div>
        {isMinor && <div className="col-md-6">{renderField("guardian")}</div>}
      </div>

      <div className="row">
        <div className="col-md-6">{renderField("relstatus")}</div>
        {isMarried && <div className="col-md-6">{renderField("spouse")}</div>}
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