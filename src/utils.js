export function validateAuthInput(val, type) {
    if (/\s/.test(val)) return 'Field cannot contain spaces.';
    if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        return 'Invalid email format.';
    }
    return null;
}

export function validatePassword(pass) {
    if (/\s/.test(pass)) return 'Password cannot contain spaces.';
    if (pass.length < 8) return 'Password must be at least 8 characters.';
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;
    if (!regex.test(pass)) {
        return 'Password needs uppercase, lowercase, number, and special character.';
    }
    return null;
}
