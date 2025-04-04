import React from "react";
import styles from "./Hero.module.css";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export const Hero = ({ product = [], email, loggedInEmail }) => {
  const navigate = useNavigate(); // Initialize navigation function

  const sliderImages = product[0]?.images?.length > 0 ? product[0].images : [];

  // Function to handle Buy Token button click
  const handleBuyToken = () => {
    navigate(`/buy-token/${email}`); // Navigate to BuyToken page with email as param
  };

  return (
    <div className={styles.all}>
      <section className={styles.container}>
        <div className={styles.leftside}>
          <img src={product[0]?.images} alt="Product" className={styles.heroImg} />
        </div>

        <div className={styles.content}>
          {product.map((item, index) => (
            <div key={index}>
              <h1 className={styles.title}>{item?.productName || "Product Name"}</h1>
              <p className={styles.description}>{item?.description || "Product description not available."}</p>
              <p className={styles.email}>Contact: {email}</p>
              <div className={styles.investor_type}>
                <div className={styles.investor_list}>
                  {item?.tags?.map((tag, i) => (
                    <Link key={i} to={`/products-by-tag/${tag}`}>
                      <button className={styles.tag}>{tag}</button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={styles.imageSlider}>
        {sliderImages.map((image, index) => (
          <img key={index} src={image} alt={`Slide ${index + 1}`} className={styles.sliderImage} />
        ))}
      </div>

      {/* Show Buttons Only If Logged-In User Matches Product Owner */}
      {loggedInEmail === email && (
        <div className={styles.buttonContainer}>
          <button className={styles.buyTokens} onClick={handleBuyToken}>
            Buy Tokens
          </button>
          <button className={styles.gainEquity}>Gain Equity</button>
        </div>
      )}
    </div>
  );
};
