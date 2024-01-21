const { generateAuthToken } = require("../../middleware/userAuth");
const usermodel = require("../../model/userModel");
const chapterModel = require("../../model/chapterModel")
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { email, password, mobile, name } = req.body;
    if (!email || !password || !mobile || !name) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
    }
    const hashpassword = await bcrypt.hash(password, 10);
    await usermodel.create({
      email: email,
      password: hashpassword,
      mobile: mobile,
      user_name: name,
    });
    return res.status(200).json({ message: "Registered successfully" });
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
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Please provide both email and password" });
    }
    const userDetails = await usermodel.findOne({
      email: email,
      is_blocked: false,
    });
    console.log(userDetails);

    if (userDetails) {
      const isMatch = await bcrypt.compare(password, userDetails.password);
      if (isMatch) {
        const response = {
          user_id: null,
          token: null,
          user_name: null,
          email: null,
          is_purchased : userDetails.is_purchased
        };
        response.token = generateAuthToken(userDetails);
        response.user_id = userDetails._id;
        response.user_name = userDetails.user_name;
        response.email = userDetails.email;
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

const fetchChapters=async(req,res)=>{
  try {
      const data = await chapterModel.find({})
      console.log(data);
      res.status(200).json({result : data})
  } catch (error) {
      console.error('Error creating chapter:', error);
      res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  signup,
  login,
  fetchChapters
};
