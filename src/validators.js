import schema from './schema';
import { validateAuthInput, validatePassword } from './utils';

const validators = {
    getErrors(d) {
        const errors = {};

        Object.entries(schema.fields).forEach(([key, field]) => {
            const raw = d[key] ?? '';
            const value = String(raw).trim();

            if (field.required && !value) {
                errors[key] = `${field.label} is required`;
                return;
            }

            if (!value) return;

            if (field.kind === 'name') {
                if (!/^[A-Za-z]+$/.test(value)) {
                    errors[key] = `${field.label} can contain letters only`;
                    return;
                }
            }

            if (field.kind === 'digits') {
                if (!/^\d+$/.test(value)) {
                    errors[key] = `${field.label} must contain digits only`;
                    return;
                }
            }

            if (field.kind === 'email') {
                const emailErr = validateAuthInput(value, 'email');
                if (emailErr) { errors[key] = emailErr; return; }
            }

            if (field.kind === 'password') {
                const passErr = validatePassword(value);
                if (passErr) { errors[key] = passErr; return; }
            }

            if (field.min && value.length < field.min) {
                errors[key] = `${field.label} should be minimum ${field.min} characters`;
                return;
            }

            if (field.exactLength && value.length !== field.exactLength) {
                errors[key] = `${field.label} must be exactly ${field.exactLength} digits`;
                return;
            }

            if (field.max !== undefined && Number(value) > field.max) {
                errors[key] = `${field.label} must be at most ${field.max}`;
                return;
            }

            if (field.regex && !field.regex.test(value)) {
                errors[key] = `Invalid ${field.label}`;
            }
        });

        const age = Number(d.age ?? 0);
        if (age < 18 && !String(d.guardian ?? '').trim()) {
            errors.guardian = 'Guardian name is required for minors';
        }

        if (String(d.relstatus ?? '') === 'married' && !String(d.spouse ?? '').trim()) {
            errors.spouse = 'Spouse name is required';
        }

        return errors;
    }
};

export default validators;