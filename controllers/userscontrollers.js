const db = require('../db/connect.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function addUser(req, res) {
    try {
        const { name, username, email, password } = req.body;
        const sql1 = "SELECT * FROM users WHERE email = ?";
        const [rows] = await db.query(sql1, [email]);

        if (rows.length > 0) {
            return res.status(409).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [name, username, email, hashedPassword]);

        return res.status(201).json({ message: "User registered successfully", insertId: result.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function registerUser(req, res) {
    try {
        const { username, password, role, department } = req.body;

        const [rows] = await db.query("SELECT id FROM users WHERE username = ?", [username]);
        if (rows.length > 0) {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (username, password, role, department) VALUES (?, ?, ?, ?)";
        const [result] = await db.query(sql, [username, hashedPassword, role, department]);

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            insertId: result.insertId
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

        if (rows.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const user = rows[0];
        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        if (user.active === 0) {
            return res.status(403).json({ success: false, message: "Account is inactive" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, department: user.department },
            process.env.JWT_SECRET || "super_secret_key",
            { expiresIn: "1h" }
        );

        return res.status(200).json({ success: true, message: "Login successful", token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

async function getUser(req, res) {
    try {
        const userId = req.params.id;
        const sql = "SELECT id, username, role, department FROM users WHERE id = ?";
        const [rows] = await db.query(sql, [userId]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User retrieved successfully", user: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function getAllUsers(req, res) {
    try {
        const sql = "SELECT id, username, role, department FROM users";
        const [rows] = await db.query(sql);
        return res.status(200).json({ message: "Users retrieved successfully", users: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function deleteUser(req, res) {
    try {
        const userId = req.params.id;
        const sql = "DELETE FROM users WHERE id = ?";
        await db.query(sql, [userId]);
        return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function UpdateUsers(req, res) {
    try {
        const { name, username, email, password } = req.body;
        const userId = req.params.id;

        let passwordValue = password;
        if (passwordValue) {
            passwordValue = await bcrypt.hash(passwordValue, 10);
        }

        const sql = "UPDATE users SET name=?, user=?, email=?, password=? WHERE id=?";
        await db.query(sql, [name, username, email, passwordValue, userId]);
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

module.exports = {
    addUser,
    registerUser,
    loginUser,
    getUser,
    getAllUsers,
    deleteUser,
    UpdateUsers
};
