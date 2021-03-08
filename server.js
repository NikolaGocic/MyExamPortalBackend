const express = require('express');

//Database
const connectDB = require('./config/db');
connectDB();



//Init
const app = express();
app.use(express.json({ extended: false }));
app.get('/',(req,res) => res.send('My Exam Portal API Running!!!'));



//Define Routes
app.use('/api/user',require('./routes/api/user'));




const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));