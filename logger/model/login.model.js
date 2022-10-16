const mongoose = require("mongoose");
const { Schema , model } = mongoose;
const bcrypt = require("bcrypt");


const UserSchema = new Schema({
  username: {required: true,
            type:String
            },
  password: {
            required: true, 
            type: String
            },
    name: {
            required: true,
            type: String
    }
})

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
})

UserSchema.methods.isValidPassword = async function(password){
    const isMatch = await bcrypt.compare(password.toString(), this.password.toString());
    return isMatch;
}

module.exports = model("User", UserSchema);

