import { useState } from "react";
import { useEntryForm } from "../hooks/useEntryForm";
import schema from "../schema";
import api from "../api";
import { toast } from 'react-toastify';



// build initial state using field KEYS not field names
const initialForm = Object.keys(schema.fields).reduce((acc, key) => {
    acc[key] = "";
    return acc;
}, {});

function EntryForm({ onSuccess }) {

  const [message, setMessage] = useState({ text: "", type: "" }); 

  const { form, setForm, errors, setErrors, counters, setCounters, handleChange, isValid, confirmPassword, setConfirmPassword, matchMsg, setMatchMsg,resetForm } = useEntryForm(initialForm);

  
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
    
    if (!isValid || confirmPassword !== form.password ) {
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
      setConfirmPassword("");
      setMatchMsg({ text: "", color: "" });
      onSuccess();

      setTimeout(() => {
        setMessage({ text: "", type: "" });
    }, 4000);

    resetForm(); 
    if (onSuccess) onSuccess();


    } else {
      setMessage({ text: "❌ Save failed.", type: "danger" });
      setTimeout(() => {
        setMessage({ text: "", type: "" });
    }, 6000);
    }

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
          <button type="submit" className="btn btn-primary" disabled={!isValid}>
          Save Entry
        </button>
      </form>
      </div>
    </div>
  );
}

export default EntryForm;