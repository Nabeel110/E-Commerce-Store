const express = require("express");
const router = express.Router();
const { database } = require("../config/helpers");

const db = database;
db.connect();

router.get("/", (req, res) => {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; // set the current page number
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 12; // set the limit of items per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit;
    endValue = page * limit;
  } else {
    startValue = 0;
    endValue = 12;
  }

  let productListQuery =
    "SELECT c.title as category, p.title as name, \
                              p.price, p.quantity, p.image, p.id, p.short_desc, \
                              p.rating, p.numReviews \
                              from products p, categories c \
                              WHERE p.cat_id = c.id  \
                              order by p.id limit 12;";

  db.query(productListQuery, (error, results, fields) => {
    if (!error) {
      res.status(200).json({
        count: results.length,
        products: results,
      });
    } else {
      res.json({
        message: "No products found",
      });
    }
  });
});

router.get("/:prod_id", (req, res) => {
  //   let productid = req.params.prod_id;
  let productQuery = "SELECT * from products where products.id=?";
  let reviewsQuery = "SELECT * from reviews where reviews.product_id =?";
  let product = {};
  let reviews = [];

  db.query(productQuery, [req.params.prod_id], (error, results, fields) => {
    if (!error) {
      product = results[0];
    } else {
      console.log(error);
    }
  });

  db.query(reviewsQuery, [req.params.prod_id], (error, results, fields) => {
    if (!error) {
      reviews = results;
      res.status(200).json({
        product: product,
        reviews: reviews,
      });
    } else {
      res.json({
        message: `No product found with ProductId ${productId}`,
      });
    }
  });
});

module.exports = router;
