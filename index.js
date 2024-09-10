const express = require('express');
const AppRoutes = require('./Routes/hallbooking.js')
const app = express();

app.use(express.json());
app.use('/',AppRoutes)

app.use("/", (req, res) => {
  res.status(200).send("welcome ");
});

app.listen(8000, ()=> console.log("Server listening to port 8000"));