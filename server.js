require('dotenv').config();
const express = require('express');
const cors = require('cors')
// Getting Routes

const authRoutes = require('./src/routes/authRoutes');
const postRoutes = require('./src/routes/postRoutes');
const commentRoutes = require('./src/routes/commentRoutes');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: '*',
    methods:["GET", "POST", "PUT", "DELETE"],
    allowedHeaders:["content-Type", "Authorization"],
    credentials:true
}));


app.use('/api/auth', authRoutes);
app.use('/api', postRoutes);
app.use('/api', commentRoutes)


PORT = process.env.PORT || 4000;

app.listen(PORT, (err) => {
    if(err) console.log(err)
    console.log(`Server is running on port ${PORT}`);
})

