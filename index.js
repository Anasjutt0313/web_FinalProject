const express = require("express");
const mongoose = require("mongoose");
const db = require('./db')
const userRoutes = require("./UserRouter");
const bookRoutes = require("./BookRouter");
const app = express();
app.use(express.json());
const PORT = 3000;



app.use("/user", userRoutes);
app.use("/books", bookRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});