import express from "express";

import {
    register,
    login,
    resetPassword
} from "../controllers/authController.js";

import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.put("/reset-password", resetPassword);

router.get("/profile", auth, (req, res) => {
    res.json({
        message: "Welcome",
        user: req.user
    });
});

export default router;