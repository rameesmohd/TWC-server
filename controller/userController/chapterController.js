const chapterModel = require("../../model/chapterModel")
const orderModel = require("../../model/orderModel");
const userModel = require("../../model/userModel");
const NodeCache = require('node-cache');
const { default: mongoose } = require("mongoose");
const cache = new NodeCache({ stdTTL: 21600 }); // Cache with a 6-hour TTL

const fetchChapters = async (req, res) => {
    try {
      const userId = new mongoose.Types.ObjectId(req.user._id);
      const user = await userModel.findOne({ _id: userId, is_blocked: false, is_purchased: true });
      const purchaseOrder = await orderModel.findOne({ user_id: userId, payment_status: 'success' });
      if (user && purchaseOrder) {
      let data = cache.get('chapters');
      if (!data) {
        const chaptersFromDB = await chapterModel.find({});
        data = chaptersFromDB.map(chapter => chapter.toObject());
        cache.set('chapters', data);
      }
        res.status(200).json({ result: data });
      } else {
        res.status(404).json({ error: 'User not found or no successful purchase order.' });
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  };

  module.exports ={
    fetchChapters
  }