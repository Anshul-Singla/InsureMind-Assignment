const mongoose = require("mongoose");

const UserAccountSchema = new mongoose.Schema({
    account_name: { type: String},
    // user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, 
// { timestamps: true }
);

module.exports = mongoose.model("userAccount", UserAccountSchema);
