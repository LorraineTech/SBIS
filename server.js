const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const db = require("./db/connect");

// 1. IMPORT YOUR ROUTE PATHWAYS
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");


// 2. CONFIGURE BODY MIDDLEWARE (Must be placed before mounting routes)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. ROOT LANDING WELCOME ROUTE
app.get("/", (req, res) => {
    res.send("Welcome to my application!");
});

// 4. MOUNT YOUR TABLES ROUTES
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// 5. BOOT UP THE APP LISTENER SERVER
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
