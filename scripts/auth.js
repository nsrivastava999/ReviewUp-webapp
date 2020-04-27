//for change in auth status
auth.onAuthStateChanged((user) => {
    if(user){
        user.getIdTokenResult().then(idTokenResult=>{
            user.admin = idTokenResult.claims.admin;
            setupUi(user);
        });
        console.log('User logged in :',user);
        //getting data from the db
        db.collection('reviews').onSnapshot(snapshot => {
            setupReview(snapshot.docs);
        }, err => console.log(err.message));
    }
    else{
        console.log('User logged out');
        setupReview([]);
        setupUi();  
    }
});

//sign up
const  signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit",function(evt){
    evt.preventDefault();
    const email = signupForm['signup-email'].value ;
    const password = signupForm['signup-password'].value ;

    //signing up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
        return db.collection('users').doc(cred.user.uid).set({
            bio:signupForm['signup-bio'].value 
        });
        // console.log(cred);
        // closeing the signup modal & resetting the form
        
    }).then(()=>{
        const modal = document.querySelector('#modal-signup');
        M.Modal.getInstance(modal).close();
        signupForm.reset();
        signupForm.querySelector(".error").innerHTML='';
    }).catch(err => {
        signupForm.querySelector(".error").innerHTML=err.message;
    });
}) ;

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click',function(evt){
    evt.preventDefault();
    auth.signOut();
});

//login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener("submit",function(evt){
    evt.preventDefault();
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;

    auth.signInWithEmailAndPassword(email,password).then(cred => {
        // console.log(cred.user);
        const modal = document.querySelector('#modal-login');
        M.Modal.getInstance(modal).close();
        loginForm.reset();
        loginForm.querySelector(".error").innerHTML='';
    }).catch(err=>{
        loginForm.querySelector(".error").innerHTML=err.message;
    });
    
});


//adding new reviews
const addForm = document.querySelector('#create-form');
addForm.addEventListener("submit",function(evt){
  evt.preventDefault();

  db.collection('reviews').add({
    title : addForm['title'].value,
    content : addForm['content'].value
  }).then(()=>{
    //clearing the form and closing the modal
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    addForm.reset();
  }).catch(err => {
      console.log(err.message);
  });
});

//add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit',(evt)=>{
    evt.preventDefault();

    const adminEmail = document.querySelector('#admin-email').value;
    const addAdminRole = functions.httpsCallable('addAdminRole');
    addAdminRole({email:adminEmail}).then(result=>{
        console.log(result);
    });
});