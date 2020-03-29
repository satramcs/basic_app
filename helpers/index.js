
module.exports.convertErrors = (errors) => {
	let convAr = {};
	for(er in errors){
		convAr[errors[er].param] = errors[er].msg;
	}
	return convAr;
};