const express = require("express");
const router = express.Router();
const {
    addUser,
    registerUser,
    loginUser,
    getUser,
    getAllUsers,
    deleteUser,
    UpdateUsers
} = require("../controllers/userscontrollers");

const { validateUser, validateRegistration, validateLogin } = require("../Middleware/validate");
const {
    authenticateJWT,
    authorizeRoles,
    authorizeDepartment,
    verifyOwnership,
    customBusinessRules
} = require("../Middleware/authMiddleware");

router.post("/add", validateUser, addUser);
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);

router.get("/get/:id", authenticateJWT, verifyOwnership, getUser);
router.get("/get", authenticateJWT, authorizeRoles("admin", "manager"), getAllUsers);
router.put("/update/:id", authenticateJWT, authorizeRoles("admin"), validateUser, UpdateUsers);
router.delete("/delete/:id", authenticateJWT, authorizeRoles("admin"), deleteUser);

router.get("/profile", authenticateJWT, (req, res) => {
    return res.status(200).json({ success: true, user: req.user });
});

router.get("/finance/demo", authenticateJWT, authorizeDepartment("Finance"), (req, res) => {
    return res.status(200).json({ success: true, message: "Finance access granted" });
});

router.get("/core/demo", authenticateJWT, customBusinessRules, (req, res) => {
    return res.status(200).json({ success: true, message: "Custom authorization rules passed" });
});

module.exports = router;
