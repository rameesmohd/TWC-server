const { generateAuthToken } = require("../../middleware/userAuth");
const bcrypt = require("bcrypt");
const userModel = require("../../model/userModel");
const nodeMailer = require('nodemailer')

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

    // if(userDetails.is_loggedin){
    //   return res.status(400).json({ message: "User already logged in! Please logout and try again" });
    // }

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

        await userModel.updateOne({_id:userDetails._id},{$set : {is_loggedin : true}})
        return res.status(200).json({ result : response,message:"Success"});
      } else {
        return res.status(400).json({ message:"Password incorrect!!"});
      }
    } else {
      return res.status(400).json({ message:"User not found!!"});
    }
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message:"Server error!!"});
  }
};

const sendResetMail=async(req,res)=>{
      try {
        const { email } = req.body
        console.log(email);
        const transporter = nodeMailer.createTransport({
          host:'smtp.gmail.com',
          port:465,
          secure:true,
          require:true,
          auth:{
              user:process.env.OFFICIALMAIL,
              pass :process.env.OFFICIALMAILPASS
          }
      })

      const mailOptions = {
          from : process.env.OFFICIALMAIL,
          to:email,
          subject:'For Verification mail',
          html:`<section style="background-color: #f8f9fa;">
          <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; margin: 0 auto; max-height: 100vh;">
            <div style="width: 100%; padding: 16px; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 0; max-width: 30rem;">
              <h2 style="margin-bottom: 8px; font-size: 1.25rem; font-weight: bold; line-height: 1.5; color: #212529;">Change Password</h2>
              <form action="#" style="margin-top: 16px; margin-bottom: 20px;">
                <a href="${process.env.CLIENT_BASE_URL}/resetpassword?email=${encodeURIComponent(email)}" style="width: 100%; background-color: #007bff; 
                color: #fff; border: none; border-radius: 0.375rem; padding: 10px; font-weight: medium; 
                font-size: 0.875rem; text-align: center; cursor: pointer; transition: 
                background-color 0.15s ease-in-out;">Verify Email</a>
              </form>
            </div>
          </div>
        </section>`
      }

      transporter.sendMail(mailOptions, function(error,info){
          if(error){
              console.log(error);
              return false
          }else{
              console.log("Email has been sent :- ",info.response);
              return true
          }
      }) 

      res.status(200).json({})
      } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ message:"Server error!!"});
      }
}


const resetNewPassword =async(req,res)=>{
  try {
    const { email ,newPass }=req.body
    const hashpassword = await bcrypt.hash(newPass, 10);
    await userModel.updateOne({email:email},{$set : {password : hashpassword}})
    res.status(200).json({message  : "Password changed successfully"})
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message:"Server error!!"});
  }
}

const sendOtp =async(req,res)=>{
  try {
      const { email ,OTP }=req.body
      console.log(email,OTP);
      const transporter = nodeMailer.createTransport({
        host:'smtp.gmail.com',
        port:465,
        secure:true,
        require:true,
        auth:{
            user:process.env.OFFICIALMAIL,
            pass :process.env.OFFICIALMAILPASS
        }
    })

    const mailOptions = {
        from : process.env.OFFICIALMAIL,
        to:email,
        subject:'For Verification mail',
        html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Fourcapedu.</a>
                </div>
                <p style="font-size:1.1em">Hi,</p>
                <p>Use the following OTP to complete your Signup procedures. OTP is valid for 1 minute</p>
                <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                <p style="font-size:0.9em;">Regards,<br />Trade Walker</p>
                <hr style="border:none;border-top:1px solid #eee" />
                <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                    <p>Fourcapedu.</p>
                    <p>1600  First floor, Oryx Arcade, VMB Rd, Koonamthai Pathadipalam Residence Association Block C</p>
                    <p>Pathadipalam, Edappally, Ernakulam, Kerala 682024</p>
                </div>
                </div>
            </div>`
    }

    transporter.sendMail(mailOptions, function(error,info){
        if(error){
            console.log(error);
            return res.status(500).json({ message:"Server error!!"});
        }else{
            console.log("Email has been sent :- ",info.response);
            return res.status(200).json({ message:"OTP sent!!"});
        }
    }) 

  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message:"Server error!!"});
  }
}

const logoutUser =async(req,res)=>{
  try {
    console.log(req.body.id);
    await userModel.updateOne({_id:req.body.id},{$set : {is_loggedin : false}})
    res.status(200).json({message  : "Password changed successfully"})
  } catch (error) {
    console.error("Error:", error.message);
    return res.status(500).json({ message:"Server error!!"});
  }
}


module.exports = {
  signup,
  login,
  sendResetMail,
  resetNewPassword,
  sendOtp,
  logoutUser
};
