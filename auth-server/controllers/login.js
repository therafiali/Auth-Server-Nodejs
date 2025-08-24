const { validateLoginData } = require("./utils/validation");
const {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
} = require("./utils/response");
const {
  generateAccessToken,
  generateRefreshToken,
  comparePassword,
  setAuthCookies,
} = require("./utils/auth");
const { findUserByEmail, updateUserRefreshToken } = require("./utils/database");

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input data
    const validationErrors = validateLoginData({ email, password });
    if (validationErrors.length > 0) {
      return sendValidationError(res, validationErrors);
    }

    // Find user by email
    let user;
    try {
      user = await findUserByEmail(email);
    } catch (error) {
      if (error.code === "PGRST116") {
        return sendUnauthorized(res, "Invalid email or password");
      }
      throw error;
    }

    if (!user) {
      return sendUnauthorized(res, "Invalid email or password");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return sendUnauthorized(res, "Invalid email or password");
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in database
    const expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString();
    await updateUserRefreshToken(user.id, refreshToken, expiresAt);

    // Set cookies
    setAuthCookies(res, accessToken, refreshToken);

    // Return success response
    sendSuccess(
      res,
      {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token: accessToken, // Changed from accessToken to token to match test expectations
        expiresIn: "15m",
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Failed to login", 500, error);
  }
};

module.exports = {
  login,
};
