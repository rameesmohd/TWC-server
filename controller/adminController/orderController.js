const orderModel = require('../../model/orderModel');
const userModel = require('../../model/userModel');
const nodeMailer = require('nodemailer')

const fetchOrder =async(req,res)=>{
    try {
        const {timeframe,filter,search,from : dateFrom,to : toDate} = req.query
        const findQuery = {};
        console.log(req.query);
        if(filter === 'success' || filter === 'rejected' || filter === 'pending'){
            findQuery.payment_status = filter 
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date();
        tomorrow.setHours(23, 59, 59, 999);
        if (dateFrom && toDate) {
            findQuery.date = { $gte: dateFrom, $lte: toDate };
        }
        if (timeframe === 'daily') {
            findQuery.date = { $gte: today, $lte: tomorrow };
        } else if (timeframe === 'weekly') {
            const lastWeek = new Date();
            lastWeek.setDate(lastWeek.getDate() - 7);
            findQuery.date = { $gte: lastWeek };
        } else if (timeframe === 'monthly') {
            const lastMonth = new Date();
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            findQuery.date = { $gte: lastMonth };
        }

        if(search){
            const searchQuery = {
                $or: [
                    { transaction_id: { $regex: new RegExp(search, 'i') } }, 
                    { email : { $regex: new RegExp(search, 'i') } }, 
                ]
            }
            Object.assign(findQuery, searchQuery);
        }    
        console.log(findQuery);
        const orderData = await orderModel.find(findQuery).sort({date : -1})
        res.status(200).json({result : orderData})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server side error!"})
    }
}

const handleOrder=async(req,res)=>{
    try {
        const {orderId,action}=req.body
        const status = action===1 ? 'success' : action===2 ? 'rejected' : ''
        const updatedOrder = await orderModel.findOneAndUpdate(
            {_id : orderId},
            {$set : {payment_status : status}},
            {new : true}
        )
        if(status=='success'){
            const user = await userModel.findOne({_id : updatedOrder.user_id})
            console.log(user);
            await userModel.updateOne({_id : updatedOrder.user_id},{$set : {is_purchased : true}})
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
                        to:user.email,
                        subject:'For Verification mail',
                        html:`<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                                <div style="margin:50px auto;width:70%;padding:20px 0">
                                <div style="border-bottom:1px solid #eee">
                                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Welcome to Fourcapedu.</a>
                                </div>
                                <p style="font-size:1.1em">Hi,</p>
                                <p>We have received your payment in full for the recent invoice. Thank you for the prompt settlement. We greatly appreciate your
                                 purchase and are here to assist you should you have any further requirements.</p>
                                <a href='https://www.fourcapedu.com/my-course' style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;
                                color: #fff;border-radius: 4px;">Go to course</a>
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
        res.status(200).json({result : updatedOrder})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server side error!"})
    }
}

module.exports = {
    fetchOrder,
    handleOrder
}