const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data,context)=>{
    //getting the user and adding admin custom claim
    return admin.auth().getUserByEmail(data.email).then(user => {
        return admin.auth().setCustomUserClaims(user.uid,{
            admin:true
        });
    }).then(()=>{
        return {
            message : "Success! Admin added."
        }
    }).catch(e => {
        return e;
    })
})