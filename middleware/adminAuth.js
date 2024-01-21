const jwt = require("jsonwebtoken");

const generateAuthToken = (user) => {
  const jwtSecretKey = process.env.JWTSECRETEKEY;
  const token = jwt.sign(
    { _id:user._id,email:user.email,role:"admin" },
    jwtSecretKey,
    { expiresIn: "48h" },
  );
  return token;
};

module.exports = {
  generateAuthToken,
};
