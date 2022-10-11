// Validation des données lors de l'inscription d'un utilisateur

exports.email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
exports.password = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
exports.sauceForm = /^(.|\s)*\S(.|\s)*$/;
// exports.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
// exports.password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;