const express = require('express');
const router = express.Router();
//const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth= require('../../middleware/auth');
const User = require('../../models/User');
const Admin = require('../../models/Admin');
const Teacher = require('../../models/Teacher');
const Student = require('../../models/Student');
const Parent = require('../../models/Parent');


//route     POST api/user/register
//desc      Register user
//token     not required
router.post('/register', [
    check('type','Type is required!').not().isEmpty(),
    check('name','Name is required!').not().isEmpty(),
    check('email','Please enter a valid email!').isEmail(),
    check('password','Password must be at least 6 and less then 30 caracters!').isLength({min: 6,max:30})
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    
    const { type,name, email, password, phone, picture } = req.body;

    try {
        let user = await User.findOne({email: email});
        if(user)  return res.status(400).json({errors: [{msg: 'User with this alredy exists'}]});

        user= new User({type,name,email,password,phone,picture});
        let profile;
        if(type==='Admin'){
            profile = new Admin({ user: user, permissions:  req.body.permissions});
        }
        if(type==='Teacher'){
            profile = new Teacher({ user: user});
        }
        if(type==='Student'){
            profile = new Student({ user: user});
        }
        if(type==='Parent'){
            profile = new Parent({ user: user});
        }
        await user.save();
        await profile.save();

        const payload = {
            user: {
                id: user.id,
                type: user.type
            }
        }

        jwt.sign(
            payload, 
            config.get('jwt'), 
            {expiresIn: 360000},
            (err,token) => {
                if(err) throw err;
                res.json({ token })
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


//route     GET api/user/login
//desc      Login
//token     not required
router.get('/login', [
    check('email','Please enter an email!').not().isEmpty(),
    check('email','Please enter a valid email!').isEmail(),
    check('password','Please enter a password!').not().isEmpty(),
    check('password','').isLength({min: 6,max:30})
], async (req,res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({errors: errors.array()});
    
    const { email, password } = req.body;

    try {
        let user = await User.findOne({email: email});
        if(!user)  return res.status(400).json({errors: [{msg: 'This email is not registerd!'}]});

        if(user.password!==password) return res.status(400).json({errors: [{msg: 'Incorrect password!'}]});

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(
            payload, 
            config.get('jwt'), 
            {expiresIn: 360000},
            (err,token) => {
                if(err) throw err;
                res.json({ token })
            }
        );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

//route     GET api/user
//desc      Get user by token
//token     required
router.get('/', auth, async (req,res) => {
    try {
        const user= await User.findById(req.user.id).select('-password');
        let profile;
        if(user.type==='Admin') {
            profile= await Admin.findOne({user: user});
        }
        if(user.type==='Teacher') {
            profile= await Teacher.findOne({user: user});
        }
        if(user.type==='Student') {
            profile= await Student.findOne({user: user});
        }
        if(user.type==='Parent') {
            profile= await Parent.findOne({user: user});
        }
        let data = {
            user: user,
            profile: profile
        }
        res.send(data);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
} );

module.exports = router;