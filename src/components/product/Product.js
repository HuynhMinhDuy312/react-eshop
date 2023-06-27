import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GET_PRICE_RANGE, selectProducts, STORE_PRODUCTS } from "../../redux/slice/productSlice";
import styles from "./Product.module.scss";
import ProductFilter from "./productFilter/productFilter";
import ProductList from "./productList/productList";
import spinnerImg from "../../assets/spinner.jpg";
import { useState } from "react";
import { FaCogs } from "react-icons/fa";
import useFetchCollection from "../../customHooks/useFetchCollection";

const Product = () => {
    const { data, isLoading } = useFetchCollection("products");
    const [showFilter, setShowFilter] = useState(false);
    const products = useSelector(selectProducts);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(STORE_PRODUCTS({ products: data }));

        dispatch(
            GET_PRICE_RANGE({
                products: data,
            })
        );
    }, [dispatch, data]);
    return (
        <section>
            <div className={`container ${styles.product}`}>
                <aside
                    className={showFilter ? `${styles.filter} ${styles.show}` : `${styles.filter}`}
                >
                    {isLoading ? null : <ProductFilter />}
                </aside>
                <div className={styles.content}>
                    {isLoading ? (
                        <img
                            src={spinnerImg}
                            alt="Loading..."
                            style={{ width: "50px" }}
                            className="--center-all"
                        />
                    ) : (
                        <ProductList products={products} />
                    )}
                    <div className={styles.icon} onClick={() => setShowFilter(!showFilter)}>
                        <FaCogs size={20} color="orangered" />
                        <p>
                            <b>{showFilter ? "Hide Filter" : "Show Filter"}</b>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Product;
