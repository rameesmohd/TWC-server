const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const jwtSecretKey = process.env.JWTSECRETEKEY;
  const token = jwt.sign(
    { _id: user._id, email: user.email, phone: user.phone, role: "user" },
    jwtSecretKey,
    { expiresIn: "48h" },
  );
  return token;
};

module.exports = {
  generateAuthToken,
};
