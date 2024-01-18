const nodeMailer = require('nodemailer')
const userModel = require("../../model/userModel");
const bcrypt = require("bcrypt");

const sendMail = async(email,OTP)=>{
    try {
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
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Trade Walker Academy</a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Use the following OTP to complete your Login procedures. OTP is valid for 1 minute</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${OTP}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Trade Walker</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>TWC Software Solutions</p>
                        <p>1600  First floor, Oryx Arcade, VMB Rd, Koonamthai Pathadipalam Residence Association Block C</p>
                        <p>Pathadipalam, Edappally, Ernakulam, Kerala 682024</p>
                    </div>
                    </div>
                </div>`
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
    } catch (error) {
        console.log(error.message);
    }
}

const login = async( req,res)=>{
    try {
        console.log(req.body);
        const admin = await userModel.findOne({email : req.body.email,is_admin : true})
        if(admin){
            const isMatch = await bcrypt.compare(req.body.password,admin.password);
            console.log(isMatch);
            if(isMatch){
                const bool =  sendMail(req.body.email,req.body.OTP)
                bool ? res.status(200).json({ message:'OTP sent successfully,please check your email' }) : res.status(500).json({message:'Error sending email'});
            }else{
                return res.status(400).json({ message:"Password incurrect!!"});
            }
        }else 
            res.status(400).json({message: 'Unauthorised access!!'})
    } catch (error) {
        console.log(error);
        res.status(500).json({})
    }
}

module.exports = { login }