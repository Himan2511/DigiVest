import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./BuyToken.css";
import { useParams } from "react-router-dom";
const BuyToken = () => {
    const { email } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  

  const [formData, setFormData] = useState({
    TokenName: "",
    NumberOfIssue: "",
    EquityDiluted: "",
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("email", email);
    data.append("TokenName", formData.TokenName);
    data.append("NumberOfIssue", formData.NumberOfIssue);
    data.append("EquityDiluted", formData.EquityDiluted);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:3001/api/virtualtokens", data);
      alert("Token purchase recorded successfully!");
      navigate("/"); // Redirect to home or another page
    } catch (error) {
      console.error("Error saving token data", error);
      alert("Failed to save token data");
    }
  };

  return (
    <div className="buy-token-container">
      <h2>Buy Token</h2>
      <form onSubmit={handleSubmit}>
        <label>Token Name:</label>
        <input type="text" name="TokenName" value={formData.TokenName} onChange={handleChange} required />
        
        <label>Number of Tokens:</label>
        <input type="number" name="NumberOfIssue" value={formData.NumberOfIssue} onChange={handleChange} required />
        
        <label>Equity Diluted:</label>
        <input type="number" name="EquityDiluted" value={formData.EquityDiluted} onChange={handleChange} required />
        
        <label>Upload Image:</label>
        <input type="file" name="image" onChange={handleFileChange} required />
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default BuyToken;
