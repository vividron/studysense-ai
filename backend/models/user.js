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
    },
    streak: {
        type: Number,
        default: 0
    },
    streakDate: {
        type: Date,
        default: null
    }
});

// Hashing password before saving
userSchema.pre("save", async function() {
    if(!this.isModified('password')){
        return;
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt);
});

// Password validation method
userSchema.methods.matchPassword = async function(pass){
    return await bcrypt.compare(pass, this.password);
}

const User = mongoose.model('User', userSchema);

export default User;