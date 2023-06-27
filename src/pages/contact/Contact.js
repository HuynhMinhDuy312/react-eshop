import React, { useRef } from "react";
import styles from "./Contact.module.scss";
import Card from "../../components/card/Card";
import { FaEnvelope, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Contact = () => {
    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm(
                process.env.REACT_APP_EMAILJS_SERVICEID,
                "template_g84hc9y",
                form.current,
                "zjLIrn0-GjJQa-Xb_"
            )
            .then(
                (result) => {
                    toast.success("Message sent successfully");
                },
                (error) => {
                    toast.error(error.text);
                }
            );
        e.target.reset();
    };

    return (
        <section>
            <div className={`container ${styles.contact}`}>
                <h2>Contact Us</h2>
                <div className={styles.section}>
                    <form ref={form} onSubmit={sendEmail}>
                        <Card cardClass={styles.card}>
                            <label>Name:</label>
                            <input type="text" name="user_name" placeholder="Full Name" required />
                            <label>Email:</label>
                            <input
                                type="email"
                                name="user_email"
                                placeholder="Your active email"
                                required
                            />
                            <label>Subject:</label>
                            <input type="text" name="subject" placeholder="Subject" required />
                            <label>Message:</label>
                            <textarea name="message" cols={30} rows={10}></textarea>
                            <button className="--btn --btn-primary" type="submit">
                                Send Message
                            </button>
                        </Card>
                    </form>
                    <div className={styles.details}>
                        <Card cardClass={styles.card2}>
                            <h3>Our Contact Information</h3>
                            <p>FIll the form or contact us via other channels listed below</p>
                            <div className={styles.icons}>
                                <span>
                                    <FaPhoneAlt />
                                    <p>+084903601096</p>
                                </span>
                                <span>
                                    <FaEnvelope />
                                    <p>SupportEShop@gmail.com</p>
                                </span>
                                <span>
                                    <GoLocation />
                                    <p>Ho Chi Minh City, Vietnam</p>
                                </span>
                                <span>
                                    <FaTwitter />
                                    <p>@DuyHuynh</p>
                                </span>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
