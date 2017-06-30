const urls = {

  CREATE_USER_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome'
};



let currentUsername


//adds hide class to elements in array of 1st param, removes hide class for elements in array of second param




const makeRequestToCreateNewUser = (username, password, firstName, lastName, callback) => {

      let settings = {
        url: urls.CREATE_USER_URL,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            username: username,
            password: password,
            firstName: firstName,
            lastName: lastName
          }),
          success: callback
      }

    $.ajax(settings)
  }

//this checks to see if user is valid, if user is valid it has callback function
//which gives us user data for us to display
const makeRequestToLogin = (username, password, callback) => {
  console.log("test")
  let settings = {
    url: urls.WELCOME_SCREEN_URL,
    contentType: 'application/json',
    headers: {
      authorization: "Basic " + btoa(username + ':' + password)
    },
    method: 'POST',
    success: callback
  }
console.log($, $.ajax)
$.ajax(settings)
};





const loginSuccessHandler = data => {
      window.location.replace(`http://localhost:8080/homepage/${data.user.username}`)
}


const directUserToLogin = data => {

  alert(`Success! New New user ${data.username} has been created! Click 'Login' to log into your account!`)

}



//const getStudyGuideData

//this function watches for user to click create new user, it then takes values supplied and passes it
//to a function that will make a post request to /users to create a new user


const watchForCreateNewUserClick = () => {
    $('.create-new-user-button').on('click', event => {

    event.preventDefault()

    let firstName = $('#first-name').val()
    let lastName = $('#last-name').val()
    let username = $('#username').val()
    let password = $('#password').val()

    makeRequestToCreateNewUser(username, password, firstName, lastName, directUserToLogin)

    })
}

//this function watches for user to click login button, takes the value of supplied username and password and passes it to
//function to validate the user
const watchForLoginClick = () => {
    $('.login-button').on('click', event => {
      event.preventDefault()


      let username = $('#login-username').val()
      let password = $('#login-password').val()

      makeRequestToLogin(username, password, loginSuccessHandler)
    })
}




const startup = () => {
    watchForCreateNewUserClick();
    watchForLoginClick();

}

$(startup);
