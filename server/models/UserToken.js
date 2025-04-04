const mongoose = require("mongoose");

const UserTokenSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, // User email
    tokens: [
        {
            tokenname: { type: String, required: true },
            tokenmail: { type: String, required: true }, // Token identifier
            quantity: { type: Number, default: 0, required: true }, 
            avgprice: { type: Number, default:0 } 
        }
    ]
});

const UserTokenModel = mongoose.model("UserToken", UserTokenSchema);
module.exports = UserTokenModel;