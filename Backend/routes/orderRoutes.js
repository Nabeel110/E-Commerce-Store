const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const pool = require("../config/helpers");

// @desc   Create new Order
// @route  POST /api/orders
// @access Private
router.post("/", protect, (req, res) => {
  const {
    orderItems,
    paymentMethod,
    itemsprice,
    taxPrice,
    shippingPrice,
    totalPrice,
    address,
    city,
    postalCode,
    country,
  } = req.body;

  const userData = {
    user_id: req.id,
  };

  let insertOrderQuery = `INSERT INTO ORDERS SET ?`;
  let paymentQuery = "INSERT INTO PAYMENT SET ?";
  let shippingQuery = "INSERT INTO SHIPPING SET ?";
  let orderDetailsQuery = "INSERT INTO ORDERS_DETAILS SET ?";

  if (orderItems && orderItems.length == 0) {
    res.status(400).json({
      message: "No order Items",
    });
  } else {
    pool.query(insertOrderQuery, userData, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const paymentFields = {
          paymentMethod,
          itemsprice,
          taxPrice,
          shippingPrice,
          totalPrice,
          order_id: result.insertId,
        };
        pool.query(paymentQuery, paymentFields, (err, result1) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result1);
          }
        });

        const shippingFields = {
          address,
          city,
          postalCode,
          country,
          order_id: result.insertId,
        };
        pool.query(shippingQuery, shippingFields, (err, result2) => {
          if (err) {
            console.log(err);
          } else {
            console.log(result2);
          }
        });

        orderItems.forEach(async (order) => {
          pool.query(
            orderDetailsQuery,
            {
              product_id: order.product,
              order_id: result.insertId,
              quantity: order.qty,
            },
            (err, result3) => {
              if (err) {
                console.log(err);
              } else {
                console.log(result3);
              }
            }
          );
        });
      }
    });
    res.status(201).json({
      id: req.id,
    });
  }
});

// db.end();
module.exports = router;
