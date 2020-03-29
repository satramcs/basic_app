const express = require("express");
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtSecret = require("../../config/keys").jwtSecret;

const {regValidation, loginValidation, verifyuserToken, checkRole} = require('../../middle/middleware');

const Users = require("../../models/Users");
const helper = require("../../helpers");

router.post("/register", regValidation, (req, res) => {
	/*Check validation errors*/
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.json({status: 0, errors: helper.convertErrors(errors.array()), message: 'Registered failed' });
	}

	/*Save user*/
	const newUser = new Users({
		name: req.body.name,
		email: req.body.email,
		password: '',
		password: bcrypt.hashSync(req.body.password, 8), /*Encrypt password*/
		role: 'user'
	});

	newUser.save().then(user => {
		res.json({status: 1, message: 'Registered successfully'});
	});
});

router.post("/login", loginValidation, (req, res) => {

	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(401).json({status: 0, errors: errors.array(), message: 'Login failed' });
	}

	Users.findOne({email:req.body.email})
	.then(user => {
		if(user && bcrypt.compareSync(req.body.password, user.password)){
			var token = jwt.sign({ id: user._id }, jwtSecret, {
      			expiresIn: 86400 // expires in 24 hours
      		});
			res.json({status: 1, token:token, message: 'Logged in successfully'});
		}else{
			res.status(401).json({status: 0, message: 'Email or password is invalid'});
		}
	});
});

router.get("/dashboard", verifyuserToken, (req, res) => {
	Users.findById(req.userId, (err, user) => {
		if(user){
			res.json({status: 1, message: 'success', data: {name:user.name, email:user.email, role:user.role }});
		}else{
			res.json({status: 0, message: 'User not found'});
		}
	});
});

router.get("/list", verifyuserToken, checkRole, (req, res) => {
	Users.find({role:{$ne:'admin'}}, {name:1, email:1, _id:0}, (err, all_users) => {
		if(all_users){
			res.json({status: 1, message: 'success', data: all_users});
		}else{
			res.json({status: 0, message: 'Users not found'});
		}
	});
});

router.get("/clear", (req, res) => {
	Users.find().remove()
	.then(ck => {
		res.json(ck);
	});
});

module.exports = router;
