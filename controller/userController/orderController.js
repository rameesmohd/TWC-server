const usermodel = require("../../model/userModel");
const chapterModel = require("../../model/chapterModel")
const orderModel = require('../../model/orderModel');
const { default: mongoose } = require("mongoose");
const cloudinary = require('../../config/cloudinary')
const fs = require('fs')
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const generateTransactionId = () => {
  return uuidv4().replace(/-/g, '').substr(0, 16);
};

const localBankOrder=async(req,res)=>{
    try {
        const localBankOrderValidation = [
            body('amount').isNumeric().withMessage('Amount must be a number'),
        ];
        await Promise.all(localBankOrderValidation.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user
        const userId = new mongoose.Types.ObjectId(user._id);
        const image = req.files.screenshot[0]
        let imageUrl = null;
        await cloudinary.uploader.upload(image.path)
            .then((data) => {
                imageUrl = data.secure_url;
            }).catch((err) => {
                res.status(500).json({ error: 'Error uploading image to Cloudinary.' });
            }).finally(()=>{
                fs.unlinkSync(image.path)
            })
        
        if(imageUrl){
            const transId = generateTransactionId();
            const newOrder = new orderModel({
            transaction_id : transId,
            payment_method: 'local_bank',
            payment_status: 'pending',
            amount: req.body.amount,
            date: new Date(),
            user_id: userId,
            user_email : user.email,
            screenshot: imageUrl,
        });
        
        await newOrder.save();
        
        res.status(200).json({message : "order placed successfully",status : 'pending'})
        }else{
        res.status(500).json({ error: 'Internal server error.' });
        }
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ error: 'Internal server error.' })
    }
} 

module.exports = {
    localBankOrder
}