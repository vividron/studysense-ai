import jwt from 'jsonwebtoken';
import User from '../models/user.js';

// Register user 
export async function signup(req, res, next) {
    const { username, email, password } = req.body;
    try {

        // Check if user exist 
        const userExist = await User.findOne({ $or: [{ email }, { username }] });

        if (userExist) {
            return res.status(400).json({
                success: false,
                error: userExist.email === email ? "Email already registered" : "Username already taken"
            });
        }

        // Create user 
        const user = await User.create({
            username,
            email,
            password
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            success: true,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                streakDate: null,
                streak: 0
            },
            token,
            message: "User registered successfully"
        });

    } catch (error) {
        next(error);
    }
}

// singin user
export async function signin(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                error: "Email not registered",
                statusCode: 401
            });
        }

        // validate password
        const isValid = await user.matchPassword(password);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid Password",
                statusCode: 401
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        // Validate streak
        if (user.streakDate) {
            const lastDate = new Date(user.streakDate).toLocaleDateString("en-CA");
            const today = new Date().toLocaleDateString("en-CA");;

            const diff = (new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24);

            if (diff > 1) {
                user.streak = 0;
                user.streakDate = null;
                await user.save();
            }
        }

        res.status(200).json({
            success: true,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
                streakDate: user.streakDate,
                streak: user.streak
            },
            token,
            message: "Login successful"
        });
    } catch (error) {
        next(error);
    }
}

export function getProfile(req, res) {

    // Get user from auth middleware (protect)
    const user = req.user;
    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage
        }
    });
}

export async function updateProfile(req, res, next) {
    try {
        // Get user from auth middleware protect handler
        const user = req.user
        const { username, email, profileImage, streak, streakDate } = req.body;

        if (username) user.username = username;
        if (email) user.email = email;
        if (profileImage) user.profileImage = profileImage;
        if (streak !== undefined) user.streak = streak;
        if (streakDate) user.streakDate = streakDate;

        await user.save();

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                streak: user.streak,
                streakDate: user.streakDate
            },
            message: "Profile updated successfully"
        })

    } catch (error) {
        next(error);
    }
}

export async function changePassword(req, res, next) {
    try {
        const user = await User.findById(req.user._id).select("+password");
        const { currentPassword, newPassword } = req.body;
        console.log(user.password)

        // validate current password
        const isValid = user.matchPassword(currentPassword);

        if (!isValid) {
            return res.status(401).json({
                success: false,
                error: "Invalid current Password",
                statusCode: 401
            });
        }

        // change password
        user.password = newPassword;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    } catch (error) {
        next(error);
    }
}