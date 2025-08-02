const jwt = require("jsonwebtoken");
const userModel = require("../model/userModel"); 

const generateAuthToken = (userId) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!jwtSecretKey) throw new Error("JWT_SECRET_KEY not defined");

  const token = jwt.sign(
    { _id: userId, role: 'user' },
    jwtSecretKey,
    { expiresIn: '48h' }
  );

  return token;
};

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.userToken;

    if (!token) {
      return res.status(401).json({ message: 'Authentication failed: No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findOne({ _id: decoded._id, is_blocked: false });

    if (!user || user.curr_token !== token) {
      return res.status(401).json({ message: "Session expired or invalid." });
    }

    if (decoded.role === 'user') {
        const { curr_token, ...safeUser } = user.toObject();
        req.user = safeUser;
        next();
    } else {
      return res.status(403).json({ message: 'Authentication failed: Invalid role.' });
    }
  } catch (error) {
    console.error('JWT verification error:', error);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Authentication failed: Token has expired.' });
    }

    return res.status(401).json({ message: 'Authentication failed: Invalid token.' });
  }
};

module.exports = {
  generateAuthToken,
  verifyToken
};
