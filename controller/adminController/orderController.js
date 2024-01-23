const orderModel = require('../../model/orderModel')

const fetchOrder =async(req,res)=>{
    try {
        const orderData = await orderModel.find({})
        console.log(orderData);
        res.status(200).json({result : orderData})
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Server side error!"})
    }
}

module.exports = {
    fetchOrder
}