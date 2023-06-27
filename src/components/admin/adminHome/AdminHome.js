import React, { useEffect } from "react";
import styles from "./AdminHome.module.scss";
import InfoBox from "../../infoBox/InfoBox";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4 } from "react-icons/bs";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
    CALC_TOTAL_ORDER_AMOUNT,
    STORE_ORDERS,
    selectOrderHistory,
    selectTotalOrderAmount,
} from "../../../redux/slice/orderSlice";
import { STORE_PRODUCTS, selectProducts } from "../../../redux/slice/productSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import Chart from "../../chart/Chart";

const earningIcon = <AiFillDollarCircle size={30} color="#b624ff" />;
const productIcon = <BsCart4 size={30} color="#b624ff" />;
const ordersIcon = <FaCartArrowDown size={30} color="#b624ff" />;

const AdminHome = () => {
    const products = useSelector(selectProducts);
    const orders = useSelector(selectOrderHistory);
    const totalOrderAmount = useSelector(selectTotalOrderAmount);

    const fbProducts = useFetchCollection("products");
    const { data } = useFetchCollection("orders");

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(
            STORE_PRODUCTS({
                products: fbProducts.data,
            })
        );
        dispatch(STORE_ORDERS(data));
        dispatch(CALC_TOTAL_ORDER_AMOUNT());
    }, [dispatch, data, fbProducts.data]);

    return (
        <div className={styles.home}>
            <h2>Admin Home</h2>
            <div className={styles["info-box"]}>
                <InfoBox
                    cardClass={`${styles.card} ${styles.card1}`}
                    title={"Earnings"}
                    count={`$${totalOrderAmount}`}
                    icon={earningIcon}
                />
                <InfoBox
                    cardClass={`${styles.card} ${styles.card2}`}
                    title={"Products"}
                    count={products.length}
                    icon={productIcon}
                />
                <InfoBox
                    cardClass={`${styles.card} ${styles.card3}`}
                    title={"Orders"}
                    count={orders.length}
                    icon={ordersIcon}
                />
            </div>
            <div>
                <Chart />
            </div>
        </div>
    );
};

export default AdminHome;
