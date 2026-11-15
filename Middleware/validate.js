function validateUser(req, res, next) {
    const { name, username, email, password } = req.body;

    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }

    if (typeof username !== "string" || username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
    }

    if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "A valid email is required" });
    }

    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    next();
}

function validateRegistration(req, res, next) {
    const { username, password, role, department } = req.body;

    if (typeof username !== "string" || username.trim() === "") {
        return res.status(400).json({ success: false, message: "Username is required" });
    }

    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    if (role !== "admin" && role !== "user" && role !== "manager") {
        return res.status(400).json({ success: false, message: "Role must be admin, user, or manager" });
    }

    if (typeof department !== "string" || department.trim() === "") {
        return res.status(400).json({ success: false, message: "Department is required" });
    }

    next();
}

function validateLogin(req, res, next) {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    next();
}

module.exports = { validateUser, validateRegistration, validateLogin };
