const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

// Initializing app
const app = express();

// Importing Routes
const productsRoute = require("./routes/products");

//Added bodyParser (Error Solution)
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "PUT", "DELETE", "PATCH", "POST"],
    allowedHeaders:
      "Access-Control-Allow-Origin, Content-Type, Authorization, Origin, X-Requested-With, Accept",
  })
);

// Use Routes
app.use("/api/products", productsRoute);

app.use(express.urlencoded({ extended: false }));

PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode at port ${PORT}`);
});
