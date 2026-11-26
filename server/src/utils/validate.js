// Plain-JS validation: values must be real strings (this also blocks
// NoSQL-injection payloads such as {"email": {"$ne": null}}).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
    nameMax: 50,
    emailMax: 254,
    passwordMin: 8,
    passwordMaxBytes: 72, // bcrypt ignores everything past 72 bytes
    messageMax: 280
};

const isString = (v) => typeof v === `string`;

const cleanEmail = (v) => (isString(v) ? v.trim().toLowerCase() : ``);

const validateRegistration = ({ name, email, password } = {}) => {
    if (!isString(name) || !name.trim() || name.trim().length > LIMITS.nameMax) {
        return `Name is required (max ${LIMITS.nameMax} characters)`;
    }
    const e = cleanEmail(email);
    if (!e || e.length > LIMITS.emailMax || !EMAIL_RE.test(e)) {
        return `A valid email is required`;
    }
    if (!isString(password) || password.length < LIMITS.passwordMin) {
        return `Password must be at least ${LIMITS.passwordMin} characters`;
    }
    if (Buffer.byteLength(password) > LIMITS.passwordMaxBytes) {
        return `Password is too long (max ${LIMITS.passwordMaxBytes} bytes)`;
    }
    return null;
};

const validateMessageContent = (content) => {
    if (!isString(content) || !content.trim()) return `Message cannot be empty`;
    if (content.trim().length > LIMITS.messageMax) {
        return `Message is too long (max ${LIMITS.messageMax} characters)`;
    }
    return null;
};

module.exports = { LIMITS, cleanEmail, validateRegistration, validateMessageContent, isString };
