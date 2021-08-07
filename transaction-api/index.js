const express = require('express');
const userRoute = require('./routes/user');
const transactionRoute = require('./routes/transaction');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bp = require('body-parser');
const cors = require('cors');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser : true, useUnifiedTopology : true})
.then(() => console.log('DB connected'))
.catch(err => console.log(err));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`)
});

const app = express();
app.use(cors());
app.use(bp.json());
app.use('/', userRoute, transactionRoute);


const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));