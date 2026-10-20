const express = require("express");
const router = express.Router();
const {
    addUser,
    getUser,
    getAllUsers,
    deleteUser,
    UpdateUsers
} = require("../controllers/userscontrollers");

// Import the validation function from your Middleware folder
const { validateUser } = require("../Middleware/validate");

// Apply the validation to POST (add) and PUT (update) routes
router.post("/add", validateUser, addUser);
router.get("/get/:id", getUser);
router.put("/update/:id", validateUser, UpdateUsers);
router.delete("/delete/:id", deleteUser);
router.get("/get", getAllUsers);

module.exports = router;
