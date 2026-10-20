const express = require("express");
const router = express.Router();
const {
    addProduct,
    getInventory,
    getProduct,
    updateProduct,
    deleteProduct
} = require("../controllers/productControlers");

router.post("/add", addProduct);
router.get("/get", getInventory);
router.get("/get/:id", getProduct);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);

module.exports = router;
