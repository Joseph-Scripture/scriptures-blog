const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client'); 
require('dotenv').config();

async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    });

    // Generate JWT token for automatic login
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,{ expiresIn: '1h' } // token valid for 1 hour
    );

    
    res.status(201).json({
      message: "User created and logged in successfully",
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email
      },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}



async function login (req, res) {
    const {email, password} = req.body;
    try{
        const user = await prisma.user.findUnique({where:{email}});
        if(!user){
            return res.status(400).json({message:"Invalid credentials"});

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
            
        }
        const accessToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({accessToken});

    }catch(err){
        res.status(500).json({message:"Server error"})
    }
};
module.exports = {
    signup,
    login
}