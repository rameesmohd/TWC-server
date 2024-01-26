const usermodel = require("../../model/userModel");
const chapterModel = require("../../model/chapterModel")
const orderModel = require('../../model/orderModel');
const { default: mongoose } = require("mongoose");
const cloudinary = require('../../config/cloudinary')
const fs = require('fs')
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')
const crypto = require('crypto');
const userModel = require("../../model/userModel");

const generateTransactionID=()=>{
    const timstamp = Date.now()
    const randomNum = Math.floor(Math.random()*1000000)
    const merchantPrefix = 'T'
    const transaction_id = `${merchantPrefix}${timstamp}${randomNum}`
    return transaction_id 
}

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
            const transId = generateTransactionID();
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

const phonePayPayment=async(req,res)=>{
    try {
        const {email,user_id,number,amount} = req.body.data
        const data = {
            merchantId: "PGTESTPAYUAT",
            merchantTransactionId: generateTransactionID(),
            merchantUserId: "MUID123",
            name : email,
            amount: amount * 100,
            redirectUrl: `http://localhost:3000/api/phonepay/status?userid=${user_id}&email=${email}`,
            redirectMode: "POST",
            mobileNumber: number,
            paymentInstrument: {
              "type": "PAY_PAGE"
            }
        }

        const payload = JSON.stringify(data)
        const payloadMain = Buffer.from(payload).toString('base64')
        const key = process.env.Salt_Key
        const keyIndex = 1
        const string = payloadMain + "/pg/v1/pay" + key
        const sha256 = crypto.createHash('sha256').update(string).digest('hex')
        const checksum = sha256 + '###' + keyIndex
        
        // const URL = " https://api.phonepe.com/apis/hermes/pg/v1/pay"
        const URL = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'

        const options = {
            method: 'post',
            url: URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY' : checksum 
                },
            data: {
                request : payloadMain
            }
          }

        await axios.request(options)
            .then(function (response) {
                return res.status(200).send(response.data.data.instrumentResponse.redirectInfo.url)
            })
            .catch(function (error) {
                console.error(error);
            });
    } catch (error) {
        console.error('Error creating chapter:', error);
        res.status(500).json({ error: 'Internal server error.' })
    }
}

const phonePayStatus=async(req,res)=>{
    try {
        const {userid , email} = req.query
        const transaction_id = res.req.body.transactionId
        const merchantId = res.req.body.merchantId
        const keyIndex = 1
        const key = process.env.Salt_Key
        const string = `/pg/v1/status/${merchantId}/${transaction_id}` + key
        const sha256 = crypto.createHash('sha256').update(string).digest('hex')
        const checksum = sha256 + '###' + keyIndex

        const URL = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transaction_id}`
        // const URL = " https://api.phonepe.com/apis/hermes/pg/v1/status/MUID123/${merchantTransactionId}"
        
        const options = {
            method : 'GET',
            url : URL,
            headers : {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY' : checksum ,
                'X-MERCHANT-ID' : merchantId
            }
        }

        //CHECK PAYMENT STATUS 
        const response = await axios.request(options);

        console.log(response.data);
        const status = response.data.data.responseCode;
        if (status === 'SUCCESS') {
            const newOrder = new orderModel({
                transaction_id: transaction_id,
                payment_method: 'phonepe',
                payment_status: 'success',
                amount: response.data.data.amount / 100,
                date: new Date(),
                user_id: userid,
                user_email: email,
            });
            await newOrder.save();
            await userModel.updateOne({_id : userid},{$set:{is_purchased : true}})
            return res.redirect(`${process.env.CLIENT_BASE_URL}/my-course`);
        } else {
            console.log('Order not placed');
            return res.redirect(`${process.env.CLIENT_BASE_URL}/checkout`);
        }
    } catch (error) {
        console.error('Error creating chapter:', error);
        return res.status(500).json({ message: 'Internal server error.', status: 'failed' });
    }
}

const fetchTrasactionData=async(req,res)=>{
    try {
        const user = req.user
        const userId = new mongoose.Types.ObjectId(user._id);
        const data= await orderModel.find({user_id : userId})
        res.status(200).json({result : data})
    } catch (error) {
        console.error('Error creating chapter:', error);
        return res.status(500).json({ message: 'Internal server error.', status: 'failed' });
    }
}

const usdtOrder=async(req,res)=>{
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
            const transId = generateTransactionID();
            const newOrder = new orderModel({
            transaction_id : transId,
            payment_method: 'usdt',
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
    localBankOrder,
    phonePayPayment,
    phonePayStatus,
    fetchTrasactionData,
    usdtOrder
}