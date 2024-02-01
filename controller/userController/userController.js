const { generateAuthToken } = require("../../middleware/userAuth");
const bcrypt = require("bcrypt");
const userModel = require("../../model/userModel");

const signup = async (req, res) => {
  try {
    const { email, password, mobile, name } = req.body;
    if (!email || !password || !mobile || !name) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
    }
    const alreadyuser =  await userModel.findOne({email : email})
  if(!alreadyuser){
    const hashpassword = await bcrypt.hash(password, 10);
    await userModel.create({
      email: email,
      password: hashpassword,
      mobile: mobile,
      user_name: name,
      join_date: Date.now()
    });
    return res.status(200).json({ message: "Registered successfully" });
  }else{
    return res.status(400).json({ message: "User already exists!" });
  }
  } catch (error) {
    console.error("Error:", error.message);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ msg: "Validation error. Please check your input." });
    }
    return res.status(500).json({ msg: "Server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
    }
    const userDetails = await userModel.findOne({
      email: email,
      is_blocked: false,
    });

    if (userDetails) {
      const isMatch = await bcrypt.compare(password, userDetails.password);
      if (isMatch) {
        console.log('matched');
        const response = {
          user_id: null,
          token: null,
          user_name: null,
          email: null,
          mobile : null,
          is_purchased : userDetails.is_purchased
        };
        response.token = generateAuthToken(userDetails);
        response.user_id = userDetails._id;
        response.user_name = userDetails.user_name;
        response.email = userDetails.email;
        response.mobile = userDetails.mobile;
        return res.status(200).json({ result : response,message:"Success"});
      } else {
        return res.status(400).json({ message:"Password incurrect!!"});
      }
    } else {
      return res.status(400).json({ message:"User not found!!"});
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message:"Server error!!"});
  }
};

module.exports = {
  signup,
  login,
};
