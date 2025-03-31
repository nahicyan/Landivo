import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import "./config/passportConfig.js"; // Import your passport configuration
import { userRoute } from "./routes/userRoute.js";
import { residencyRoute } from "./routes/residencyRoute.js";
import { buyerRoute } from "./routes/buyerRoute.js";
import { sessionLogger, ensureAuthenticated } from "./middlewares/sessionMiddleware.js";
import { qualificationRoute } from "./routes/qualificationRoute.js";
import { buyerListRoute } from "./routes/buyerListRoute.js";

const app = express();
const PORT = process.env.PORT || 8200;

// 1) Create __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2) Load client.json configuration
const clientConfig = JSON.parse(fs.readFileSync("client.json", "utf8")).web;

// 3) Middleware setup
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["https://landivo.com"], 
    credentials: true,
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);



app.use(
  session({
    secret: "strong_secret_key", // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,    // Helps prevent XSS attacks
      secure: false,     // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
      sameSite: "lax",   // CSRF protection
    },
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", clientConfig.redirect_uris[0]); // Allow frontend URL
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


app.use(passport.initialize());
app.use(passport.session());

// 4) Middleware for logging session and request information
app.use(sessionLogger);

// 5) Serve static "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 6) API routes
app.use("/api/user", userRoute);
app.use("/api/residency", residencyRoute);
app.use("/api/buyer", buyerRoute);
app.use("/api/qualification", qualificationRoute);

// 7) Authentication routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    console.log("Google callback triggered:", req.user);
    res.redirect(`${clientConfig.redirect_uris[0]}?user=${req.user.email}`);
  }
);

app.get("/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.status(200).json({ message: "Logout successful" }); // Send JSON response
  });
});

// 8) Test session endpoint (with authentication check)
app.get("/auth/test-session", ensureAuthenticated, (req, res) => {
  console.log("Session user:", req.user);
  res.json({ message: "Session active", user: req.user });
});

// 9) Start the server
app.listen(PORT, () => {
  console.log("Uploads folder path:", path.join(__dirname, "uploads"));
  console.log(`Backend is running on port ${PORT}`);
});


app.use("/api/buyer-lists", buyerListRoute);
