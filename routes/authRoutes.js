import express from "express";

import {
    register,
    login,
    forgotPassword,
    resetPassword
} from "../controllers/authController.js";

import auth from "../middleware/authMiddleware.js";


const router = express.Router();


// Register
router.post("/register", register);


// Login
router.post("/login", login);


// Forgot Password
router.post("/forgot-password", forgotPassword);


// Reset Password
router.post("/reset-password/:token", resetPassword);


// Protected Profile
router.get("/profile", auth, (req, res) => {

    res.json({
        message: "Welcome",
        user: req.user
    });

});


export default router;