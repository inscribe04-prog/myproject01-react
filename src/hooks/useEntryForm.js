import { useState } from "react";
import schema from "../schema";

export function useEntryForm(initialState) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [counters, setCounters] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [matchMsg, setMatchMsg] = useState({ text: "", color: "" });



  // Calculate if  are any active errors
  const isValid = Object.values(errors).every(err => err === "" || err === undefined);

  function handleChange(e) {
    // 1. Copy your regex and "live error" logic here from EntryForm
   
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

    // 2. Add your counter logic here
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
    // // 3. setForm, setErrors, setCounters accordingly
    // if (errors[name]) {
    //   setErrors((prev) => ({ ...prev, [name]: "" }));
    // }
 
  }

  return { form, setForm, errors, setErrors, counters, setCounters, handleChange, isValid, confirmPassword, setConfirmPassword, matchMsg, setMatchMsg };
}