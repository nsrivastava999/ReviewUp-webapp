// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);
  
});

const reviewList = document.querySelector(".reviews");

//setting up each review
const setupReview = function(docs) {
  
  if(docs.length){
    let html = "";
    docs.forEach(doc => {
      const review = doc.data();
      // console.log(review);
      const li = `
        <li>
          <div class='collapsible-header blue lighten-4'>${review.title}</div>
          <div class='collapsible-body blue lighten-5'>${review.content}</div>
        </li>
      `;
      html+=li;
    });
    reviewList.innerHTML=html;
  }
  else{
    reviewList.innerHTML = "<h5 class='center-align'>Login/Signup to see the reviews</h5>";
  }

}

const loggedoutLinks = document.querySelectorAll('.logged-out');
const loggedinLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('admin');

const setupUi = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Logged in as ${user.email}</div>
        <div>${doc.data().bio}</div>
        <div class="pink-text">${user.admin ? 'Admin' : ''}</div>
      `;
      accountDetails.innerHTML = html;
    });
    // toggle user UI elements
    loggedinLinks.forEach(item => item.style.display = 'block');
    loggedoutLinks.forEach(item => item.style.display = 'none');
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    adminItems.forEach(item => item.style.display = 'none');
    loggedinLinks.forEach(item => item.style.display = 'none');
    loggedoutLinks.forEach(item => item.style.display = 'block');
  }
};
