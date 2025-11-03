const exp=require('express');
const router=exp.Router();
const User=require('../models/User');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

router.post('/signup', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const exists = await User.findOne({ email });
        if (exists) return res.json({ message: 'User already exists' });
        const hash = bcrypt.hashSync(password, 10);
        const user = new User({ name, email, password: hash, role });
        await user.save();
        res.json({ message: 'signup successful' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: err.message });
    }
});

router.post('/login',async(req,res)=>{
    try{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user) return res.json({message:'User not found'});
    const isMatch=bcrypt.compareSync(password,user.password); 
    if(!isMatch) return res.json({message:'Invalid credentials'});
    const token=jwt.sign({id:user._id, role: user.role},process.env.JWT_SECRET, { expiresIn: "2d" });
    res.json({token, role: user.role,name: user.name});
    } catch(err){
        console.error('Login error:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports=router;