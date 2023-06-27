import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaTimes, FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth } from "../../firebase/config";
import { REMOVE_ACTIVE_USER, SET_ACTIVE_USER } from "../../redux/slice/authSlice";
import AdminOnlyRoute, { AdminOnlyLink } from "../adminOnlyRoute/AdminOnlyRoute";
import ShowOnLogin, { ShowOnLogout } from "../hiddenLink/hiddenLink";
import styles from "./Header.module.scss";
import { CALCULATE_TOTAL_QUANTITY, selectCartTotalQuantity } from "../../redux/slice/cartSlice";

const Logo = (
    <div className={styles.logo}>
        <Link to="/">
            <h2>
                e<span>Shop</span>.
            </h2>
        </Link>
    </div>
);

const activeLink = ({ isActive }) => (isActive ? `${styles.active}` : "");

const Header = () => {
    const [showMenu, setShowMenu] = useState(false);
    const [displayName, setDisplayName] = useState("");
    const [scrollPage, setScrollPage] = useState(false);

    const cartTotalQuantity = useSelector(selectCartTotalQuantity);

    useEffect(() => {
        dispatch(CALCULATE_TOTAL_QUANTITY());
    }, []);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const fixedNavBar = () => {
        if (window.scrollY > 50) {
            setScrollPage(true);
        } else {
            setScrollPage(false);
        }
    };
    window.addEventListener("scroll", fixedNavBar);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const hideMenu = () => {
        setShowMenu(false);
    };

    const logoutUser = () => {
        signOut(auth)
            .then(() => {
                toast.success("Logout Successful...");
                navigate("/login");
            })
            .catch((error) => {
                toast.error(error.message);
            });
    };

    const Cart = (
        <span className={styles.cart}>
            <Link to="/cart">
                Cart
                <FaShoppingCart size={20} className={styles["cart-icons"]} />
                <p>{cartTotalQuantity}</p>
            </Link>
        </span>
    );

    //Monitor currently sign in user
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // const uid = user.uid;
                // console.log(user);
                if (user.displayName) {
                    setDisplayName(user.displayName);
                } else {
                    const u1 = user.email.substring(0, user.email.indexOf("@"));
                    const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
                    setDisplayName(uName);
                }
                dispatch(
                    SET_ACTIVE_USER({
                        email: user.email,
                        userName: user.displayName ? user.displayName : displayName,
                        userID: user.uid,
                    })
                );
            } else {
                setDisplayName("");
                dispatch(REMOVE_ACTIVE_USER());
            }
        });
    }, [dispatch, displayName]);

    return (
        <>
            <header className={scrollPage ? `${styles.fixed}` : null}>
                <div className={styles.header}>
                    {Logo}
                    <nav className={showMenu ? `${styles["show-nav"]}` : `${styles["hide-menu"]}`}>
                        <div
                            className={
                                showMenu
                                    ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}`
                                    : `${styles["nav-wrapper"]}`
                            }
                            onClick={hideMenu}
                        ></div>
                        <ul onClick={hideMenu}>
                            <li className={styles["logo-mobile"]}>
                                {Logo}
                                <FaTimes size={22} color="#fff" onClick={hideMenu} />
                            </li>
                            <AdminOnlyLink>
                                <li>
                                    <Link to="/admin/home">
                                        <button className="--btn --btn-primary">Admin</button>
                                    </Link>
                                </li>
                            </AdminOnlyLink>
                            <li>
                                <NavLink to="/" className={activeLink}>
                                    Home
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact" className={activeLink}>
                                    Contact Us
                                </NavLink>
                            </li>
                        </ul>
                        <div className={styles["header-right"]} onClick={hideMenu}>
                            <span className={styles.links}>
                                <ShowOnLogout>
                                    <NavLink to="/login" className={activeLink}>
                                        Login
                                    </NavLink>
                                </ShowOnLogout>
                                <ShowOnLogin>
                                    <a href="#home">
                                        <FaUserCircle size={16} />
                                        Hi, {displayName}
                                    </a>
                                </ShowOnLogin>
                                <ShowOnLogout>
                                    <NavLink to="/register" className={activeLink}>
                                        Register
                                    </NavLink>
                                </ShowOnLogout>
                                <ShowOnLogin>
                                    <NavLink to="/order-history" className={activeLink}>
                                        My Orders
                                    </NavLink>
                                    <NavLink to="/" onClick={logoutUser}>
                                        Logout
                                    </NavLink>
                                </ShowOnLogin>
                            </span>
                            {Cart}
                        </div>
                    </nav>
                    <div className={styles["menu-icon"]}>
                        {Cart}
                        <HiOutlineMenuAlt3 size={28} onClick={toggleMenu} />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
