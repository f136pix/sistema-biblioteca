const {db} = require('../config/db.config');
const usersRef = db.collection('users');

const {createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail} = require("firebase/auth");
const {auth} = require('../config/db.config');

// lodash usado para formatar os dados
var _ = require("lodash");


exports.authenticateUser = async (data) => {
    let user = " "
    let userToken = " "
    await signInWithEmailAndPassword(auth, data.email, data.password)
        .then(async (userCredential) => {
            user = userCredential.user;
            userToken = await user.getIdToken();
            return userToken
        })
    return userToken
}

exports.registerUser = async (data) => {
    if (data.passwordConfirm !== data.password) {
        const error = new Error("As senhas inseridas devem ser iguais")
        error.statusCode = 400;
        throw error;
    }

    await createUserWithEmailAndPassword(auth, data.email, data.password)
        .then((userCredential) => {
            const user = userCredential.user;
            usersRef.doc(user.uid).set({
                nome: data.nome + " " + data.sobrenome,
                email: data.email
            })
            console.log("Usuario criado : ", user);
        })
}

exports.logoutSession = async() => {

}


exports.sendEmailPassword = async (data) => {
    await sendPasswordResetEmail(auth, data.email)
    return data.email

}





