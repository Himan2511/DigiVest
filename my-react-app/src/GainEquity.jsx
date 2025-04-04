import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './GainEquity.css';

const GainEquity = () => {
  const { email } = useParams();
  const navigate = useNavigate();
  const [tokenData, setTokenData] = useState(null);
  const [coinsToPurchase, setCoinsToPurchase] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/virtualtokens/${email}`);
        setTokenData({
          ...response.data,
          NumberOfIssue: parseFloat(response.data.NumberOfIssue).toFixed(8),
          EquityDiluted: parseFloat(response.data.EquityDiluted).toFixed(4)
        });
      } catch (err) {
        setError('Failed to fetch token data');
        console.error('Error fetching token data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTokenData();
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!coinsToPurchase || isNaN(coinsToPurchase)) {
      setError('Please enter a valid number of coins');
      return;
    }

    const coinsNum = parseFloat(coinsToPurchase);
    if (coinsNum <= 0) {
      setError('Number of coins must be positive');
      return;
    }

    if (coinsNum > parseFloat(tokenData.NumberOfIssue)) {
      setError(`Cannot purchase more than ${tokenData.NumberOfIssue} coins`);
      return;
    }

    try {
      // Calculate new values with proper decimal handling
      const equityPerCoin = parseFloat(tokenData.EquityDiluted) / parseFloat(tokenData.NumberOfIssue);
      const newEquityDiluted = (equityPerCoin * coinsNum).toFixed(4);
      const newNumberOfIssue = (parseFloat(tokenData.NumberOfIssue) - coinsNum).toFixed(8);

      // Update payload with proper decimal values
      const updatePayload = {
        email,
        TokenName: tokenData.TokenName,
        CurrentPrice: tokenData.CurrentPrice,
        NumberOfIssue: newNumberOfIssue,
        EquityDiluted: newEquityDiluted,
        image: tokenData.image
      };

      const response = await axios.put(`http://localhost:3001/api/virtualtokens/update`, {
        ...updatePayload,
        coinsPurchased: coinsNum
      });

      if (response.data.deleted) {
        alert('Token purchased and removed as coins reached zero!');
      } else {
        alert('Equity successfully updated!');
      }
      navigate('/my-investments');
    } catch (err) {
      setError('Failed to update equity: ' + (err.response?.data?.error || err.message));
      console.error('Error updating equity:', err);
    }
  };

  if (loading) return <div className="loading">Loading token data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!tokenData) return <div className="error">No token data found</div>;

  return (
    <div className="gain-equity-container">
      <h2>Gain Equity in {tokenData.TokenName}</h2>
      
      <div className="token-info">
        <p><strong>Current Price:</strong> {tokenData.CurrentPrice}</p>
        <p><strong>Current Equity Diluted:</strong> {tokenData.EquityDiluted}%</p>
        <p><strong>Coins Available:</strong> {tokenData.NumberOfIssue}</p>
        <p><strong>Token Owner:</strong> {email}</p>
      </div>

      <form onSubmit={handleSubmit} className="equity-form">
        <div className="form-group">
          <label htmlFor="coins">Number of Coins to Purchase:</label>
          <input
            type="number"
            id="coins"
            value={coinsToPurchase}
            onChange={(e) => setCoinsToPurchase(e.target.value)}
            min="0"
            step="0.00000001" // Allows 8 decimal places
            max={tokenData.NumberOfIssue}
            required
          />
        </div>

        <div className="form-group">
          <p><strong>New Equity Hold After Purchase:</strong> 
            {coinsToPurchase ? 
              ` ${( parseFloat(parseFloat(tokenData.EquityDiluted)- (parseFloat(tokenData.EquityDiluted) / parseFloat(tokenData.NumberOfIssue)) * parseFloat(coinsToPurchase))).toFixed(4)}%` : 
              ' Enter coins to calculate'
            }
          </p>
          <p><strong>Remaining Coins:</strong>
            {coinsToPurchase ?
              ` ${parseFloat(tokenData.NumberOfIssue) - parseFloat(coinsToPurchase)}` :
              tokenData.NumberOfIssue
            }
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" className="submit-btn">
          Purchase Equity
        </button>
      </form>
    </div>
  );
};

export default GainEquity;