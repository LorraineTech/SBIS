const db = require("../db/connect.js");

async function addProduct(req, res) {
    try {
        const { product_name, quantity, price } = req.body;
        if (typeof product_name !== "string" || !product_name.trim() ||
            !Number.isInteger(Number(quantity)) || Number(quantity) < 0 ||
            !Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                error: "product_name, a non-negative integer quantity, and a non-negative price are required"
            });
        }

        const sql = "INSERT INTO products (product_name, quantity, price) VALUES (?, ?, ?)";
        const [result] = await db.query(sql, [product_name.trim(), Number(quantity), Number(price)]);
        
        return res.status(200).json({ 
            success: true,
            message: "Product added to inventory successfully!", 
            productId: result.insertId 
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

async function getInventory(req, res) {
    try {
        const sql = "SELECT * FROM products";
        const [rows] = await db.query(sql);
        
        return res.status(200).json({ success: true, inventory: rows });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

async function getProduct(req, res) {
    try {
        const productId = Number(req.params.id);
        if (!Number.isInteger(productId) || productId < 1) {
            return res.status(400).json({ success: false, error: "Invalid product id" });
        }

        const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);
        if (rows.length === 0) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        return res.status(200).json({ success: true, product: rows[0] });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

async function updateProduct(req, res) {
    try {
        const productId = Number(req.params.id);
        const { product_name, quantity, price } = req.body;
        if (!Number.isInteger(productId) || productId < 1) {
            return res.status(400).json({ success: false, error: "Invalid product id" });
        }
        if (typeof product_name !== "string" || !product_name.trim() ||
            !Number.isInteger(Number(quantity)) || Number(quantity) < 0 ||
            !Number.isFinite(Number(price)) || Number(price) < 0) {
            return res.status(400).json({
                success: false,
                error: "product_name, a non-negative integer quantity, and a non-negative price are required"
            });
        }

        const sql = "UPDATE products SET product_name = ?, quantity = ?, price = ? WHERE id = ?";
        const [result] = await db.query(sql, [product_name.trim(), Number(quantity), Number(price), productId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }
        
        return res.status(200).json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

async function deleteProduct(req, res) {
    try {
        const productId = Number(req.params.id);
        if (!Number.isInteger(productId) || productId < 1) {
            return res.status(400).json({ success: false, error: "Invalid product id" });
        }

        const [result] = await db.query("DELETE FROM products WHERE id = ?", [productId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Product not found" });
        }

        return res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
}

module.exports = { 
    addProduct,
     getInventory,
     getProduct,
     updateProduct,
     deleteProduct
     };
