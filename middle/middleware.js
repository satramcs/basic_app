const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const jwtSecret = require("../config/keys").jwtSecret;


const emailExist = (value) => {
	return Users.findOne({email:value}).then(user => {
		if (user) {
			return Promise.reject('Email already in use');
		}
	});	
}

module.exports.regValidation = [
check('name').trim().not().isEmpty().isLength({min:5, max:25}).withMessage('Name is required and name should be min 5 and max 25 characters in length'),
check('email').isEmail().custom(value => emailExist(value)).withMessage('Invalid email address'),
check('password').isLength({ min: 8, max: 16 }).withMessage('Password is required and min 8 and max 16 in length'),
check('confirm_password').custom((value, { req }) => {
	if (value !== req.body.password) {
		throw new Error('Password confirmation does not match password');
	}
	return true;
})
];

module.exports.loginValidation = [
check('email').isEmail().withMessage('Invalid email address'),
check('password').isLength({ min: 8, max: 16 }).withMessage('Invalid password'),
];

module.exports.verifyuserToken = (req, res, next) => {
	var token = req.headers['x-access-token'];
	if (!token)
		return res.json({ status: 0, message: 'No token provided.' });

	jwt.verify(token, jwtSecret, function(err, decoded) {
		if (err)
			return res.json({ status: 0, message: 'Failed to authenticate token.' });

		/*if everything good, save to request for use in other routes*/
		req.userId = decoded.id;
		next();
	});
}

module.exports.checkRole = (req, res, next) => {
	Users.findOne({_id:req.userId, role:'admin'}, (err, user) => {
		if(!user)
			return res.json({ status: 0, message: 'Do not have a access.' });

		next();
	})
}