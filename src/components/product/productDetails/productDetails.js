import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import StarsRating from "react-star-rate";
import spinnerImg from "../../../assets/spinner.jpg";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import {
    ADD_TO_CART,
    CALCULATE_TOTAL_QUANTITY,
    DECREASE_CART,
    selectCartItems,
} from "../../../redux/slice/cartSlice";
import Card from "../../card/Card";
import styles from "./productDetails.module.scss";

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const cart = cartItems.find((cart) => cart.id === id);
    const { document } = useFetchDocument("products", id);
    const { data } = useFetchCollection("reviews");
    const filterReviews = data.filter((review) => review.productID === id);

    const isCartAdded = cartItems.findIndex((cart) => {
        return cart.id === id;
    });

    useEffect(() => {
        setProduct(document);
    }, [document]);

    const addToCart = (product) => {
        dispatch(ADD_TO_CART(product));
        dispatch(CALCULATE_TOTAL_QUANTITY());
    };

    const decreaseCart = (product) => {
        dispatch(DECREASE_CART(product));
        dispatch(CALCULATE_TOTAL_QUANTITY());
    };

    return (
        <section>
            <div className={`container ${styles.product}`}>
                <h2>Product Details</h2>
                <div>
                    <Link to="/#products">&larr; Back To Products</Link>
                </div>
                {product === null ? (
                    <img src={spinnerImg} alt="Loading" />
                ) : (
                    <>
                        <div className={styles.details}>
                            <div className={styles.img}>
                                <img
                                    src={product.imageURL}
                                    alt={product.name}
                                    styles={{ width: "50px" }}
                                />
                            </div>
                            <div className={styles.content}>
                                <h3>{product.name}</h3>
                                <p className={styles.price}>{`$${product.price}`}</p>
                                <p>{product.desc}</p>
                                <p>
                                    <b>SKU:</b> {product.id}
                                </p>
                                <p>
                                    <b>Brand:</b> {product.brand}
                                </p>
                                <div className={styles.count}>
                                    {isCartAdded < 0 ? null : (
                                        <>
                                            <button
                                                className="--btn"
                                                onClick={() => decreaseCart(product)}
                                            >
                                                -
                                            </button>
                                            <p>
                                                <b>{cart.cartQuantity}</b>
                                            </p>
                                            <button
                                                className="--btn"
                                                onClick={() => addToCart(product)}
                                            >
                                                +
                                            </button>
                                        </>
                                    )}
                                </div>
                                <button
                                    className="--btn --btn-danger"
                                    onClick={() => addToCart(product)}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        </div>
                    </>
                )}
                <Card cardClass={styles.card}>
                    <h3>Product Reviews</h3>
                    <div>
                        {filterReviews.length === 0 ? (
                            <p>There are no reviews fro this product yet.</p>
                        ) : (
                            <>
                                {filterReviews.map((userReview, index) => {
                                    const { rate, review, reviewDate, userName } = userReview;
                                    return (
                                        <div className={styles.review}>
                                            <StarsRating value={rate} />
                                            <p>{review}</p>
                                            <span>
                                                <b>{reviewDate}</b>
                                            </span>
                                            <br />
                                            <span>
                                                <b>By: {userName}</b>
                                            </span>
                                        </div>
                                    );
                                })}
                            </>
                        )}
                    </div>
                </Card>
            </div>
        </section>
    );
};

export default ProductDetails;
