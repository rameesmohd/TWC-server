const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
    lessonVideoUrl: {
      type: String,
      required: true,
    }
  });
  
const chapterSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    lessons: [lessonSchema]
  });
  
const chapterModel = new mongoose.model("chapter", chapterSchema);
module.exports = chapterModel;
