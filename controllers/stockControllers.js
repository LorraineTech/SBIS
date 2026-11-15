const db = require("../db/connect.js");

// Handle Stock In Operations (Receiving Supplies)
async function stockIn(req, res) {
    try {
        const { product_id, quantity, supplier } = req.body;

        // 1. Validation checks
        if (!Number.isInteger(Number(product_id)) || Number(product_id) < 1 ||
            !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) {
            return res.status(400).json({
                success: false,
                error: "Valid product_id and a positive integer quantity are required."
            });
        }

        // 2. Check if the product exists in the database
        const [productCheck] = await db.query("SELECT id FROM products WHERE id = ?", [product_id]);
        if (productCheck.length === 0) {
            return res.status(404).json({ success: false, error: "Product not found." });
        }

        // 3. Execution: Log the transaction history record
        await db.query(
            "INSERT INTO stock_in (product_id, quantity, supplier) VALUES (?, ?, ?)", 
            [product_id, quantity, supplier || null]
        );

        // 4. Execution: Increment the live primary count in the products table
        await db.query(
            "UPDATE products SET quantity = quantity + ? WHERE id = ?", 
            [quantity, product_id]
        );

        return res.status(200).json({
            success: true,
            message: `Successfully stocked in ${quantity} units!`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: "Internal server error." });
    }
}

module.exports = {
    stockIn
};
