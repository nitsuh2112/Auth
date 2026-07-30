import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/userModel.js";


// Register
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



// Login
export const login = async (req, res) => {
    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        const match = await bcrypt.compare(password, user.password);


        if (!match) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }


        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );


        res.json({
            message: "Login successful",
            token
        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};




// Forgot Password
export const forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;


        const user = await User.findOne({ email });


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        const resetToken = crypto.randomBytes(32).toString("hex");


        user.resetToken = resetToken;

        user.resetTokenExpire = Date.now() + 3600000; // 1 hour


        await user.save();


        res.json({

            message: "Password reset token created",

            token: resetToken

        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }

};




// Reset Password
export const resetPassword = async (req, res) => {

    try {

        const { newPassword } = req.body;


        const user = await User.findOne({

            resetToken: req.params.token,

            resetTokenExpire: { $gt: Date.now() }

        });



        if (!user) {

            return res.status(400).json({

                message: "Invalid or expired token"

            });

        }



        const hashedPassword = await bcrypt.hash(newPassword, 10);



        user.password = hashedPassword;


        user.resetToken = undefined;

        user.resetTokenExpire = undefined;


        await user.save();



        res.json({

            message: "Password reset successfully"

        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }

};