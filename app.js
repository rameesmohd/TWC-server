const express = require("express");
const app = express();
const connectdb = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");
const adminRoute = require('./routes/adminRoute');
const multer = require("multer");
const createError = require('http-errors');
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require('helmet');
dotenv.config();

connectdb();

app.set('trust proxy', 1);

app.use(helmet({
  contentSecurityPolicy:false,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-origin" },
  dnsPrefetchControl: { allow: false },
  expectCt: { maxAge: 86400 },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { policy: "none" },
  referrerPolicy: { policy: "no-referrer" },
  xssFilter: true
}));

app.set('trust proxy', 1);

// app.use(cors({ credentials: true, origin: process.env.CLIENT_BASE_URL }));
app.use(cors({
  origin: [ "https://www.fourcapedu.com","http://localhost:5173","https://twc-client-pearl.vercel.app"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true })); 
app.use(cookieParser());
app.use(bodyParser.json()); 

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
