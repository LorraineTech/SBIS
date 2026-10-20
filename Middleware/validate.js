function validateUser(req, res, next) {
    const { name, username, email, password } = req.body;

    // 1. Validate Name
    if (typeof name !== "string" || name.trim() === "") {
        return res.status(400).json({ message: "Name is required" });
    }

    // 2. Validate Username
    if (typeof username !== "string" || username.trim() === "") {
        return res.status(400).json({ message: "Username is required" });
    }

    // 3. Validate Email
    if (typeof email !== "string" || !email.includes("@")) {
        return res.status(400).json({ message: "A valid email is required" });
    }

    // 4. Validate Password (must be at least 6 characters)
    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Everything is valid, proceed to the controller
    next();
}

module.exports = { validateUser };
