const nodeMailer = require('nodemailer')
const userModel = require("../../model/userModel");
const bcrypt = require("bcrypt");
const { generateAuthToken } = require("../../middleware/userAuth");
const chapterModel = require('../../model/chapterModel')

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
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Fourcapedu.</a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Use the following OTP to complete your Login procedures. OTP is valid for 1 minute</p>
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
                return false
            }else{
                console.log("Email has been sent :- ",info.response);
                return true
            }
        }) 
    } catch (error) {
        console.log(error.message);
        res.status(500).json({})
    }
}

const resendOtp =async(req,res)=>{
    try {
        const bool = sendMail(req.body.email,req.body.OTP)
        bool ? res.status(200).json({ message:'OTP sent successfully,please check your email' }) : res.status(500).json({message:'Error sending email'});
    } catch (error) {
        console.log(error);
        res.status(500).json({})
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
                const token = generateAuthToken(admin);
                bool ? res.status(200).json({ token,message:'OTP sent successfully,please check your email' }) : res.status(500).json({message:'Error sending email'});
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

const fetchUsers=async(req,res)=>{
    try {
        const { search ,is_purchased ,is_completed}= req.query
        const searchQuery = {
            $or: [
            { name: { $regex: new RegExp(search, 'i') } }, 
            { email : { $regex: new RegExp(search, 'i') } }, 
            ]
        }
        const query = {
            ...(search !=='' && (isNaN(Number(search)) ? searchQuery : { mobile: Number(search) })),
            ...(is_purchased && { is_purchased }),
            ...(is_completed && { is_completed }),
            is_admin : false
        }
        const users = await userModel.find(query,{password : 0})
        res.status(200).json({result : users})
    } catch (error) {
        console.log(error);
        res.status(500).json({})
    }
}

const blockToggle=async(req,res)=>{
    try {
        console.log(req.body);
        const {id,currStatus} = req.body
        await userModel.updateOne({_id : id},{$set : {is_blocked : !currStatus}})
        res.status(200).json({})
    } catch (error) {
        console.log(error);
        res.status(500).json({})
    }
}

const addChapter = async (req, res) => {
    try {
      const { title } = req.body;
      if (!title) {
        return res.status(400).json({ error: 'Title is required.' });
      }
      const existingChapter = await chapterModel.findOne({ title });
      if (existingChapter) {
        return res.status(409).json({ error: 'Chapter with this title already exists.' });
      }
      const newChapter = await chapterModel.create({ title });
      console.log('New chapter created:', newChapter);
      res.status(201).json({ message: 'Chapter created successfully.', chapter: newChapter });
    } catch (error) {
      console.error('Error creating chapter:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
};

const editChapter=async(req,res)=>{
    try {
        const {id ,title} = req.body
        const data = await chapterModel.updateOne({_id : id},{$set :{title : title}})
        res.status(200).json({result : data})
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

const fetchChapters=async(req,res)=>{
    try {
        const data = await chapterModel.find({})
        res.status(200).json({result : data})
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

const deleteChapter=async(req,res)=>{
    try {
        const {id} = req.query
        const data = await chapterModel.deleteOne({_id : id})
        res.status(200).json({result : data})
    } catch (error) {
        console.error('Error deleting chapter:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}
  
const addLesson=async(req,res)=>{
    try {
        const {videoUrl,chapterId} = req.body
        const updatedChapter = await chapterModel.findOneAndUpdate(
            { _id: chapterId },
            { $addToSet: { lessons: { lessonVideoUrl: videoUrl } } },
            { new: true, useFindAndModify: false }
          );
        res.status(200).json({ result : updatedChapter , message : "Lesson added successfully!"})
    } catch (error) {
        console.error('Error adding lesson:', error);
        res.status(500).json({ error: 'Internal server error.' });
}
}

const deleteLesson=async(req,res)=>{
    try {
        const { chapterId,lessonId } = req.query
        const updatedChapter = await chapterModel.findOneAndUpdate(
            { _id: chapterId },
            { $pull: { lessons: { _id: lessonId } } },
            { new: true, useFindAndModify: false }
          );
        res.status(200).json({result : updatedChapter,message : 'Lesson deleted successfully'})
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
}

module.exports = { 
    login,
    resendOtp,
    fetchUsers,
    blockToggle,
    addChapter,
    fetchChapters,
    editChapter,
    deleteChapter,
    addLesson,
    deleteLesson
}

