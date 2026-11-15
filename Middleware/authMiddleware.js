const jwt = require('jsonwebtoken');
const db = require('../db/connect.js');
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';

// Step 6: Authentication Middleware (Check keycard)
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access denied. Missing token." });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info to the request object
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Step 7: Role-Based Access Control (RBAC Middleware)
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Insufficient privileges." });
        }
        next();
    };
};

// Step 8: Attribute-Based Access Control (ABAC Middleware by Department)
const authorizeDepartment = (allowedDepartment) => {
    return (req, res, next) => {
        if (!req.user || req.user.department !== allowedDepartment) {
            return res.status(403).json({ message: `Forbidden: Requires access to the ${allowedDepartment} department.` });
        }
        next();
    };
};

// Step 9: Resource Ownership Middleware
const verifyOwnership = (req, res, next) => {
    const requestedResourceId = parseInt(req.params.id, 10);
    // Allow users to access their own data, OR let admins bypass the check
    if (req.user.id !== requestedResourceId && req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: You cannot access another user's data." });
    }
    next();
};

// Step 10: Custom Business Rules (Active accounts & working hours)
const customBusinessRules = async (req, res, next) => {
    try {
        const [rows] = await db.query('SELECT active FROM users WHERE id = ?', [req.user.id]);
        if (!rows || rows.length === 0) {
            return res.status(403).json({ message: "Authorization failed: User account not found." });
        }
        if (rows[0].active === 0) {
            return res.status(403).json({ message: "Authorization failed: Your account is inactive." });
        }

        const currentHour = new Date().getHours();
        if (currentHour < 9 || currentHour >= 17) {
            return res.status(403).json({ message: "Authorization failed: Core resources are restricted outside working hours (09:00 - 17:00)." });
        }
        next();
    } catch (err) {
        return res.status(500).json({ message: "Internal validation error" });
    }
};

module.exports = {
    authenticateJWT,
    authorizeRoles,
    authorizeDepartment,
    verifyOwnership,
    customBusinessRules
};
