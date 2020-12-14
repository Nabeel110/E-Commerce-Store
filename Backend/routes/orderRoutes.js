const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const pool = require("../config/helpers");
const { decodeBase64 } = require("bcryptjs");

// @desc   Create new Order
// @route  POST /api/orders
// @access Private
router.post("/", protect, (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsprice,
    taxPrice,
    shippingPprice,
    totalPrice,
  } = req.body;

  const userData = {
    user_id: req.id,
  };

  const orderItems ={
      
  }
  console.log(req.id);
  res.status(200).json({
    message: "No orders yet",
  });

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({
      message: "No order Items",
    });
  } else {
    let insertOrderQuery = `INSERT INTO ORDERS SET ?`;
    let insertOrderItems = `INSERT INTO ORDER_DETAILS SET ?`;

    pool.query(insertOrderQuery, userData, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        pool.query(insertOrderItems, userData, (err, result) => {
            if (err) {
              console.log(err);
            } else {
              
            }
      }
    });
  }
});

// db.end();
module.exports = router;
