//contains URLS for API calls
const Urls = {

  USER_DATABASE_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome',
  GET_CLASSES_URL: '/users/welcome/my-classes'
};

const classReferences = {
  dashboard_page: '.dashboard-page',
  current_classes_page: '.current-classes-page',
  prior_classes_page: '.prior-classes-page',
  my_saved_resources_page: '.my-saved-resources-page',
  my_uploaded_resources_page: '.my-uploaded-resources-page'
}

const state = {
  username: null,
  firstName: null,
  lastName: null,
}
//adds hide class to elements in array of 1st param, removes hide class for elements in array of second param
const addAndRemoveHideClass = (addArray, removeArray) => {

    addArray.forEach(element => {
        $(element).addClass('hide')
    })

    removeArray.forEach(element => {
        $(element).removeClass('hide')
    })

};


const makeRequestToCreateNewUser = (username, password, firstName, lastName, callback) => {

      let settings = {
        url: Urls.USER_DATABASE_URL,
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

const makeRequestToValidateUser = (username, password, callback) => {

  let settings = {
    url: Urls.WELCOME_SCREEN_URL,
    contentType: 'application/json',
    headers: {
        username: username,
        password: password
    },
    method: 'GET',
      success: callback
  }

$.ajax(settings)
}

const makeRequesttoGetUserData = ({user: {username, firstName, lastName}}, callback) => {
  console.log(username)
  state.username = username;
  state.firstName = firstName;
  state.lastName = lastName;

  let settings = {
    url: `${Urls.GET_CLASSES_URL}`,
    contentType: 'application/json',
    method: 'POST',
    data: JSON.stringify({
      username: username
    }),
    success: displayClasses
  }

  $.ajax(settings)
  }


const displayClasses = (data) => {

console.log(data)


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

    makeRequestToCreateNewUser(username, password, firstName, lastName, displayData)

    })
}

//this function watches for user to click login button, takes the value of supplied username and password and passes it to
//function to validate the user
const watchForLoginClick = () => {
    $('.login-button').on('click', event => {
      event.preventDefault()

      let username = $('#login-username').val()
      let password = $('#login-password').val()
      console.log(username)
      makeRequestToValidateUser(username, password, makeRequesttoGetUserData)
    })
}

const watchForGoToCurrentClassesClick = () => {
    $('.go-to-my-current-classes-button').on('click', event => {
    event.preventDefault();



    let user = state.username;
    getCurrentClassesForUser(user, displayClasses)

    })
}

const watchForAddNewClassClick = () => {

}
const init = () => {
    watchForCreateNewUserClick();
    watchForLoginClick();
    watchForGoToCurrentClassesClick();
}

$(init);
