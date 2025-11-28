require('dotenv').config();
const express = require('express');
// Getting Routes

const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);

PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log(`Server is running on port ${PORT}`);
})

