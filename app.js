const express = require("express");
const app = express();
const connectdb = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const adminRoute = require('./routes/adminRoute');
const multer = require("multer");
const createError = require('http-errors');

connectdb();
// app.use(cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
app.use(cors({
  origin: [ "https://www.tradewalkeredu.com","http://localhost:5173","https://twc-client.vercel.app"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));

app.use(express.json({ limit: "10mb" }));
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

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
