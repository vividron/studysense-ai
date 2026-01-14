import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export async function protect(req, res, next) {

    // check if token exist in authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Extract token 
            const token = req.headers.authorization.split(' ')[1];
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decode.id);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: "User not found",
                    statusCode: 401
                });
            }
            req.user = user;
            next();
        }
        catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({
                    success: false,
                    error: "Token has expired",
                    type: "token",
                    statusCode: 401
                });
            }

            return res.status(401).json({
                success: false,
                error: "Not authorized, invalid token",
                type: "token",
                statusCode: 401

            });
        }

    } else {
        res.status(401).json({
            success: false,
            error: "Not authorized, token not found",
            type: "token",
            statusCode: 401
        });
    }
}

// Captures a Zod schema via closure, to validate the request body.
export const validate = (schema) => (req, res, next) => {
    const parseBody = schema.safeParse(req.body);

    if (!parseBody.success) {
        return res.status(400).json({
            success: false,
            error: parseBody.error.issues.map(e => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
    }
    next();
}