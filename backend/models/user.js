import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false 
    },
    profileImage: {
        type: String,
        default: null
    }
});

// Hashing password before saving
userSchema.pre("save", async function() {
    if(!this.isModified('password')){
        return;
    }
    this.password = await bcrypt.hash(this.password, 10);
});

// Password validation method
userSchema.methods.matchPassword = async function(pass){
    return await bcrypt.compare(pass, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;