const orderModel = require('../../model/orderModel')

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
        const updatedData = await orderModel.findOneAndUpdate(
            {_id : orderId},
            {$set : {payment_status : status}},
            {new : true}
        )
        res.status(200).json({result : updatedData})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server side error!"})
    }
}

module.exports = {
    fetchOrder,
    handleOrder
}