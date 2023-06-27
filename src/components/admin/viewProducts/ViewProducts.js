import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import Notiflix from "notiflix";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useFecthCollection from "../../../customHooks/useFetchCollection";
import { db, storage } from "../../../firebase/config";
import { selectProducts, STORE_PRODUCTS } from "../../../redux/slice/productSlice";
import Loader from "../../loader/Loader";
import styles from "./ViewProducts.module.scss";
import Search from "../../search/Search";
import { FILTER_BY_SEARCH, selectFilteredProducts } from "../../../redux/slice/filterSlice";
import Pagination from "../../pagination/Pagination";

const ViewProducts = () => {
    const [search, setSearch] = useState("");
    const { data, isLoading } = useFecthCollection("products");
    const products = useSelector(selectProducts);
    const filteredProducts = useSelector(selectFilteredProducts);

    const dispatch = useDispatch();

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productPerPage, setProductPerPage] = useState(5);

    // Get Current Products
    const indexOfLastProduct = currentPage * productPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    useEffect(() => {
        dispatch(STORE_PRODUCTS({ products: data }));
    }, [dispatch, data]);

    useEffect(() => {
        dispatch(FILTER_BY_SEARCH({ products, search }));
    }, [dispatch, products, search]);

    const deleteProduct = async (id, imageURL) => {
        try {
            await deleteDoc(doc(db, "products", id));
            const storageRef = ref(storage, imageURL);
            await deleteObject(storageRef);
            toast.success("Product deleted successfully");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const confirmDelete = (id, imageURL) => {
        Notiflix.Confirm.show(
            "Delete Product",
            "You are about to delete this product",
            "Delete",
            "Cancel",
            function okCb() {
                deleteProduct(id, imageURL);
            },
            function cancelCb() {
                console.log("Delete canceled");
            },
            {
                width: "320px",
                borderRadius: "8px",
                titleColor: "orangered",
                okButtonBackground: "orangered",
                cssAnimationStyle: "zoom",
            }
        );
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className={styles.table}>
                <h2>All Products</h2>
                <div className={styles.search}>
                    <p>
                        <b>{filteredProducts.length}</b> products found
                    </p>
                    <Search value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                {products.length === 0 ? (
                    <p>No product found.</p>
                ) : (
                    <table>
                        <tbody>
                            <tr>
                                <th>S/N</th>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Actions</th>
                            </tr>
                            {currentProducts.map((product, index) => {
                                const { id, name, category, price, imageURL } = product;
                                return (
                                    <tr key={id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={imageURL}
                                                alt={name}
                                                style={{ width: "100px" }}
                                            />
                                        </td>
                                        <td>{name}</td>
                                        <td>{category}</td>
                                        <td>{`$${price}`}</td>
                                        <td className={styles.icons}>
                                            <Link to={`/admin/add-product/${id}`}>
                                                <FaEdit size={20} color="green" />
                                            </Link>
                                            &nbsp;
                                            <FaTrashAlt
                                                size={18}
                                                color="red"
                                                onClick={() => confirmDelete(id, imageURL)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
                <Pagination
                    productsPerPage={productPerPage}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    totalProducts={filteredProducts.length}
                />
            </div>
        </>
    );
};

export default ViewProducts;
