import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { db, storage } from "../../../firebase/config";
import { selectProducts } from "../../../redux/slice/productSlice";
import Card from "../../card/Card";
import Loader from "../../loader/Loader";
import styles from "./AddProduct.module.scss";

const categories = [
    {
        id: 1,
        name: "Laptop",
    },
    {
        id: 2,
        name: "Electronics",
    },
    {
        id: 3,
        name: "Fashion",
    },
    {
        id: 4,
        name: "Phone",
    },
    {
        id: 5,
        name: "Computer Hardware",
    },
    {
        id: 6,
        name: "Mouse",
    },
    {
        id: 7,
        name: "Keyboard",
    },
];

const initialState = {
    name: "",
    imageURL: "",
    price: 0,
    category: "",
    brand: "",
    desc: "",
};

const AddProduct = () => {
    const { id } = useParams();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const products = useSelector(selectProducts);
    const productEdit = products.find((item) => item.id === id);

    const detectForm = (id, f1, f2) => {
        if (id === "add") {
            return f1;
        }
        return f2;
    };

    const [product, setProduct] = useState(() => {
        const newState = detectForm(id, { ...initialState }, productEdit);
        return newState;
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value,
        });
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // console.log(file);
        const storageRef = ref(storage, `eshop/${Date.now()}${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            },
            (error) => {
                toast.error(error.message);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setProduct({ ...product, imageURL: downloadURL });
                    toast.success("Image uploaded successfully");
                });
            }
        );
    };

    const addProduct = (e) => {
        e.preventDefault();
        // console.log(product);
        setIsLoading(true);
        try {
            const docRef = addDoc(collection(db, "products"), {
                name: product.name,
                imageURL: product.imageURL,
                price: Number(product.price),
                category: product.category,
                brand: product.brand,
                desc: product.desc,
                createdAt: Timestamp.now().toDate(),
            });
            setIsLoading(false);
            toast.success("Product added successfully");
            setUploadProgress(0);
            setProduct({ ...initialState });
            navigate("/admin/all-products");
        } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
        }
    };

    const editProduct = (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (product.imageURL !== productEdit.imageURL) {
            const storageRef = ref(storage, productEdit.imageURL);
            deleteObject(storageRef);
        }

        try {
            setDoc(doc(db, "products", id), {
                name: product.name,
                imageURL: product.imageURL,
                price: Number(product.price),
                category: product.category,
                brand: product.brand,
                desc: product.desc,
                createdAt: productEdit.createdAt,
                editedAt: Timestamp.now().toDate(),
            });
            setIsLoading(false);
            toast.success("Product edited successfully.");
            navigate("/admin/all-products");
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <>
            {isLoading && <Loader />}
            <div className={styles.product}>
                <h1>{detectForm(id, "Add Product", "Edit Product")}</h1>
                <Card cardClass={styles.card}>
                    <form onSubmit={detectForm(id, addProduct, editProduct)}>
                        <label>Product name:</label>
                        <input
                            type="text"
                            placeholder="Product name"
                            required
                            name="name"
                            value={product.name}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <label>Product Image:</label>
                        <Card cardClass={styles.group}>
                            {uploadProgress === 0 ? null : (
                                <div className={styles.progress}>
                                    <div
                                        className={styles["progress-bar"]}
                                        style={{ width: `${uploadProgress}%` }}
                                    >
                                        {uploadProgress < 100
                                            ? `Uploading ${uploadProgress}%`
                                            : "Upload Complete"}
                                    </div>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                placeholder="Product Image"
                                name="image"
                                onChange={(e) => handleImageChange(e)}
                            />
                            {product.imageURL === "" ? null : (
                                <input
                                    type="text"
                                    // required
                                    placeholder="Image URL"
                                    name="imageURL"
                                    disabled
                                    value={product.imageURL}
                                />
                            )}
                        </Card>
                        <label>Product price:</label>
                        <input
                            type="number"
                            placeholder="Product price"
                            required
                            name="price"
                            value={product.price}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <label>Product category:</label>
                        <select
                            name="category"
                            required
                            value={product.category}
                            onChange={(e) => handleInputChange(e)}
                        >
                            <option value="" disabled>
                                -- Choose Product Category --
                            </option>
                            {categories.map((category) => {
                                return (
                                    <option key={category.id} value={category.name}>
                                        {category.name}
                                    </option>
                                );
                            })}
                        </select>
                        <label>Product company/brand:</label>
                        <input
                            type="text"
                            placeholder="Product brand"
                            required
                            name="brand"
                            value={product.brand}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <label>Product description:</label>
                        <textarea
                            name="desc"
                            value={product.desc}
                            required
                            cols="30"
                            rows="10"
                            onChange={(e) => handleInputChange(e)}
                        />
                        <button type="submit" className="--btn --btn-primary">
                            {detectForm(id, "Save Product", "Edit Product")}
                        </button>
                    </form>
                </Card>
            </div>
        </>
    );
};

export default AddProduct;
