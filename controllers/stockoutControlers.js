const db = require("../db/connect.js");

async function stockOut(req, res) {
    try {
        const { product_id, quantity, reason } = req.body;

        if (!Number.isInteger(Number(product_id)) || Number(product_id) < 1 ||
            !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
            return res.status(400).json({
                success: false,
                error: "Valid product_id and a positive integer quantity are required."
            });
        }

        const [productRows] = await db.query("SELECT quantity FROM products WHERE id = ?", [product_id]);
        if (productRows.length === 0) {
            return res.status(404).json({ success: false, error: "Product not found." });
        }

        const currentStock = productRows[0].quantity;
        if (currentStock < Number(quantity)) {
            return res.status(400).json({
                success: false,
                error: `Insufficient stock. Only ${currentStock} units available.`
            });
        }

        await db.query(
            "INSERT INTO stock_out (product_id, quantity, reason) VALUES (?, ?, ?)", 
            [product_id, Number(quantity), reason || 'sale']
        );

        await db.query(
            "UPDATE products SET quantity = quantity - ? WHERE id = ?", 
            [Number(quantity), product_id]
        );

        return res.status(200).json({
            success: true,
            message: `Successfully stocked out ${quantity} units!`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error." });
    }
}

module.exports = {
    stockOut
};
