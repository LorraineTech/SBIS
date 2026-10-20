const db = require("../db/connect.js");

// 1. Add User (Singular match for your route)
async function addUser(req, res) {
    try {
        const { name, username, email, password } = req.body;

        const sql = "INSERT INTO users (name, user, email, password) VALUES (?, ?, ?, ?)";
        // In mysql2/promise, await directly returns an array [rows, fields]
        const [result] = await db.query(sql, [name, username, email, password]);
        
        return res.status(200).json({ message: "User registered successfully", insertId: result.insertId });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 2. Get Single User
async function getUser(req, res) {
    try {
        const userId = req.params.id;
        const sql = "SELECT * FROM users WHERE id = ?";
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

// 3. Get All Users
async function getAllUsers(req, res) {
    try {
        const sql = "SELECT * FROM users";
        const [rows] = await db.query(sql);
        
        return res.status(200).json({ message: "Users retrieved successfully", users: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// 4. Delete User
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

// 5. Update User
async function UpdateUsers(req, res) {
    try {
        const name = req.body.name;
        const user = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const userId = req.params.id; // Usually sent via URL params

        const sql = "UPDATE users SET name=?, user=?, email=?, password=? WHERE id=?";
        await db.query(sql, [name, user, email, password, userId]);
        
        return res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

// CRITICAL FIX: Export all functions so userRoutes.js can access them
module.exports = {
    addUser,
    getUser,
    getAllUsers,
    deleteUser,
    UpdateUsers
}; 
