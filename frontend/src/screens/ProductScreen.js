import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Rating from "../components/Rating";

import { useDispatch, useSelector } from "react-redux";
import { listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);

  const { loading, error, product, reviews } = productDetails;

  // console.log(productDetails);

  useEffect(() => {
    dispatch(listProductDetails(match.params.id));
  }, [dispatch, match]);

  const addToCartHandler = () => {
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  return (
    <>
      <Link className="btn btn-light my-2" to="/">
        {"<"} Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Row>
          <Col md={6}>
            <Image
              style={{ borderRadius: "20%" }}
              src={product.image}
              alt={product.name}
              fluid
              className="mb-5"
            />
          </Col>
          <Col md={6}>
            <Card>
              <ListGroup.Item>
                <h2 className="text-center">Product Details</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <h3 className="text-center" style={{ color: "orangered" }}>
                  {product.title}
                </h3>
                {/* need to add rating */}
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                <br />
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </ListGroup.Item>
              <ListGroup.Item>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Quantity: {product.quantity}
                </p>
              </ListGroup.Item>
              <ListGroup.Item>
                <strong style={{ fontWeight: "bold", fontSize: "16px" }}>
                  Description:{" "}
                </strong>
                {product.description}
                <br />
              </ListGroup.Item>
              <ListGroup.Item>
                <p style={{ fontSize: "20px", fontWeight: "bold" }}>
                  Price: PKR {product.price}
                </p>
              </ListGroup.Item>
              {product.quantity > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <h4>Qty</h4>
                    </Col>
                    <Col>
                      {/* <h4>Qty</h4> */}
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(e.target.value)}
                      >
                        {[...Array(product.quantity).keys()].map((x) => (
                          <option key={x + 1}>{x + 1}</option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <Button
                onClick={addToCartHandler}
                variant="dark"
                size="lg"
                block
                disabled={product.quantity === 0}
              >
                <h4 style={{ color: "white" }}>
                  <i className="fas fa-shopping-cart"></i> Add to Cart
                </h4>
              </Button>
            </Card>
          </Col>
        </Row>
      )}
    </>
  );
};

export default ProductScreen;
