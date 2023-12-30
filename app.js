const express = require("express");
const app = express();
const connectdb = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/userRoute");

connectdb();

app.use(cors());
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoute);

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
