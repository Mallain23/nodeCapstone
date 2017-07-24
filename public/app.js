//change name of file to login.js
//base url const - localhost:8080
//still need currentUsername ?
//const id tag
//if logged out, goes to homepage, if logged in go to user homepage
//user declarative code and destrucutring whenever possible

const urls = {

  CREATE_USER_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome'
};


//adds hide class to elements in array of 1st param, removes hide class for elements in array of second param




const makeRequestToCreateNewUser = (username, password, firstName, lastName, success) => {

      const settings = {
        url: urls.CREATE_USER_URL,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            username,
            password,
            firstName,
            lastName
        }),
        success
      }

    $.ajax(settings)
  }

//this checks to see if user is valid, if user is valid it has callback function
//which gives us user data for us to display
const makeRequestToLogin = (username, password, success) => {

  const settings = {
    url: urls.WELCOME_SCREEN_URL,
    contentType: 'application/json',
    data: JSON.stringify({
        username,
        password
    }),
    method: 'POST',
    success
  }

  $.ajax(settings)
};


const loginSuccessHandler = ({ message, user }) => {

        if (user) {
            window.location.replace('http://localhost:8080/homepage')
            return
        };

        alert(message)
}


const directUserToLogin = ({ username, message: error }) => {

    if (username) {
        alert(`Success! New user ${username} has been created! Click 'Login' to log into your account!`)
        return
    }
    // if (message) {
    //     alert(message)
    //     return
    // }
    //
    // alert("Something went wrong with your request, please try again")
  //  const message = error ? error : "Something went wrong with your request, please try again" //make variable for something went wrong string
    const message = error || "Something went wrong with your request, please try again"
    alert(message)
}



//this function watches for user to click create new user, it then takes values supplied and passes it
//to a function that will make a post request to /users to create a new user

const watchForCreateNewUserClick = () => {
    $('.create-user').on('click', event => {

        $('#first-name').val('')
        $('#last-name').val('')
        $('#username').val('')
        $('#password').val('')
    })
}

const watchForCreateNewUserSubmit = () => {
    $('.create-new-user-button').on('click', event => {

    event.preventDefault()

    const firstName = $('#first-name').val()
    const lastName = $('#last-name').val()
    const username = $('#username').val()
    const password = $('#password').val()

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


      const username = $('#login-username').val()
      const password = $('#login-password').val()

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
