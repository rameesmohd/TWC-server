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
      console.log(user);
      if (user) {
        let data = cache.get('chapters');
      if (!data) {
      }
        const chaptersFromDB = await chapterModel.find({});
        data = chaptersFromDB.map(chapter => chapter.toObject());
        cache.set('chapters', data);
        res.status(200).json({ result: data ,user : { is_purchased:user.is_purchased,
          completed_chapters : user.completed_chapters}});
      } else {
        res.status(200).json({ result: [] });
      }
    } catch (error) {
      console.error('Error fetching chapters:', error);
      res.status(500).json({ error: 'Internal server error while fetching courses' });
    }
  };

  
const handleChapterCompletes = async (req, res) => {
  try {
    const chapterId= new mongoose.Types.ObjectId(req.body.chapterId);
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const updatedData = await userModel.findOneAndUpdate(
      { _id: userId, is_blocked: false },
      {
        $addToSet: { completed_chapters: chapterId },
      },
      { new: true, fields: { completed_chapters: 1, is_purchased: 1 } }
    );
    res.status(200).json({result : updatedData})
  } catch (error) {
    console.error('Error fetching chapters:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
  
module.exports ={
  fetchChapters,
  handleChapterCompletes,
}