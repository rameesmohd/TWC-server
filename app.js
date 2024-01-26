const express = require("express");
const app = express();
const connectdb = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const adminRoute = require('./routes/adminRoute');
const multer = require("multer");
const createError = require('http-errors');

connectdb();
app.use(cors({ credentials: true, origin: 'http://localhost:5173' }));
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/admin",adminRoute)
app.use("/api",userRoute);


//-------------HTTP Error Handling -------//
app.use(async (req, res, next) => {
  next(createError.NotFound('This route does not exist!!'));
})

app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.send({
      error: {
          status: err.status || 500,
          message: err.message
      }
  })
})

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
