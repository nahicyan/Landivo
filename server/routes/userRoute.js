import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  loginSuccess,
  loginFailed,
  googleLoginRedirect,
} from "../controllers/userCntrl.js";
import passport from "passport";
import { getAllUsers } from "../controllers/userCntrl.js";

const router = express.Router();

// Standard Authentication Routes
router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/all", getAllUsers);

// Google Authentication Routes
router.get("/login/success", loginSuccess);  // Check if the user is logged in
router.get("/login/failed", loginFailed);    // Handle failed login

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));  // Start Google OAuth
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/api/user/login/failed" }),
  googleLoginRedirect  // Custom controller to handle successful login and return token
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect(process.env.CLIENT_URL);
  });
});

export { router as userRoute };
