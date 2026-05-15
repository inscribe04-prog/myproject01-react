import { useState } from "react";

function NameInput({ label, min }) {
  const [name, setName] = useState("");

  const color = name.length === 0 ? 'gray' : (name.length < min ? 'red' : 'green');

  return (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <input
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={`Enter ${label}`}
      />
      <span style={{ color }}>
        {name.length === 0 ? '' : `${name.length} character${name.length >= 2 ? 's' : ''} entered`}
      </span>
    </div>
  );
}

export default NameInput;