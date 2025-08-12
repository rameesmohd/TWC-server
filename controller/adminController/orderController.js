const { paymentSuccessMail } = require('../../assets/mails');
const orderModel = require('../../model/orderModel');
const userModel = require('../../model/userModel');
const nodeMailer = require('nodemailer')
const { Resend } =require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

const fetchOrder = async (req, res) => {
  try {

    const query = {};
    for (const key in req.query) {
      const trimmedKey = key.trim();
      query[trimmedKey] = req.query[key].trim?.() || req.query[key];
    }

    const timeframe = query.timeframe;
    const filter = query.filter;
    const search = query.search;
    const dateFrom = query.from;
    const toDate = query.to;

    const findQuery = {};

    // Apply payment_status filter
    if (['success', 'rejected', 'pending'].includes(filter)) {
      findQuery.payment_status = filter;
    }

    // Handle time-based filters
    const now = new Date();
    if (dateFrom && toDate) {
      const fromDate = new Date(dateFrom);
      const untilDate = new Date(toDate);
      untilDate.setHours(23, 59, 59, 999); // Include the whole day
      findQuery.date = { $gte: fromDate, $lte: untilDate };
    } else if (timeframe === 'daily') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      findQuery.date = { $gte: start, $lte: end };
    } else if (timeframe === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 7);
      findQuery.date = { $gte: lastWeek };
    } else if (timeframe === 'monthly') {
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      findQuery.date = { $gte: lastMonth };
    }

    // Handle search query
    if (search) {
      findQuery.$or = [
        { user_email: { $regex: new RegExp(search, 'i') } },
        { transaction_id: { $regex: new RegExp(search, 'i') } },
      ];
    }

    // console.log(findQuery, 'Final Query');

    const orderData = await orderModel.find(findQuery).sort({ date: -1 });

    return res.status(200).json({ result: orderData });
  } catch (error) {
    console.error('Fetch order error:', error);
    return res.status(500).json({ message: "Server side error!" });
  }
};


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
                  const data = await resend.emails.send({
                    from: 'Fourcapedu Support <noreply@fourcapedu.com>',
                    to: user.email,
                    subject: 'Payment Confirmation - Fourcapedu',
                    html: paymentSuccessMail(user),
                  });

                  console.log("Payment confirmation email sent via Resend:", data);
                  return res.status(200).json({result : updatedOrder, message: "Payment confirmation sent!" });

                } catch (error) {
                  console.error("Error sending payment confirmation:", error);
                  return res.status(500).json({ message: "Server error!!" });
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