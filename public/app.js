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

  let settings = {
    url: urls.WELCOME_SCREEN_URL,
    contentType: 'application/json',
    // headers: {
    //   authorization: "Basic " + btoa(username + ':' + password)
    // },
    data: JSON.stringify({
            username: username,
            password: password
          }),
    method: 'POST',
    success: callback
  }

$.ajax(settings)
};


const loginSuccessHandler = data => {

        if (data.user) {
          //  window.location.replace(`http://localhost:8080/homepage/${data.user.username}`)
            window.location.replace('http://localhost:8080/homepage')
            return
        };

        alert(data.message)
}


const directUserToLogin = data => {
    console.log(data)
    if (data.username) {
        alert(`Success! New New user ${data.username} has been created! Click 'Login' to log into your account!`)
        return
    }
    if (data.message) {
        alert(data.message)
        return
    }

    alert("Something went wrong with your request, please try again")

}



//this function watches for user to click create new user, it then takes values supplied and passes it
//to a function that will make a post request to /users to create a new user

const watchForCreateNewUserClick = () => {
    $('.create-user').on('click', event => {
        console.log("Sd")
        $('#first-name').val('')
        $('#last-name').val('')
        $('#username').val('')
        $('#password').val('')
    })
}

const watchForCreateNewUserSubmit = () => {
    $('.create-new-user-button').on('click', event => {

    event.preventDefault()

    let firstName = $('#first-name').val()
    let lastName = $('#last-name').val()
    let username = $('#username').val()
    let password = $('#password').val()

    makeRequestToCreateNewUser(username, password, firstName, lastName, directUserToLogin)

    })
}


const watchForLoginClick = () => {
    $('.login').on('click', event => {

        $('#login-username').val('')
        $('#login-password').val('')
    })
}
//this function watches for user to click login button, takes the value of supplied username and password and passes it to
//function to validate the user
const watchForLoginSubmitClick = () => {
    $('.login-button').on('click', event => {
      event.preventDefault()


      let username = $('#login-username').val()
      let password = $('#login-password').val()

      makeRequestToLogin(username, password, loginSuccessHandler)
    })
}

const init = () => {
    watchForCreateNewUserClick();
    watchForLoginClick();
    watchForLoginSubmitClick();
    watchForCreateNewUserSubmit();

}

$(init);
