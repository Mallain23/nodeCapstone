//contains URLS for API calls
const Urls = {

  CREATE_USER_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome'
};

const classReferences = {
  dashboard_page: '.dashboard-page',
  current_classes_page: '.current-classes-page',
  prior_classes_page: '.prior-classes-page',
  my_saved_resources_page: '.my-saved-resources-page',
  my_uploaded_resources_page: '.my-uploaded-resources-page',
  add_a_course_container: '.add-a-course-container',
  create_new_resource_window: '.create-new-resource-window',
  message_box: '.message-box',
  create_new_user_container: '.create-new-user-container',
  login_container: '.login-container',
  login_message: '.login-message'

}

const state = {
    currentClasses: [],
    uploadedResources: []
};

const resetState = () => {
    state.username = null,
    state.firstName = null,
    state.lastName = null,
    state.currentClasses = [],
    state.uploadedResources = []
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

const handlePopup = (showPop, hidePop) => {
  $(showPop).fadeIn('slow');
  $(hidePop).fadeOut('slow');

}

const makeRequestToCreateNewUser = (username, password, firstName, lastName, callback) => {

      let settings = {
        url: Urls.CREATE_USER_URL,
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
    url: Urls.WELCOME_SCREEN_URL,
    contentType: 'application/json',
    headers: {
      authorization: "Basic " + btoa(username + ':' + password)
    },
    method: 'POST',
    success: callback
  }

$.ajax(settings)
}





const loginSuccessHandler = data => {
      console.log(data)
      window.location.replace(`http://localhost:8080/homepage/${data.user.username}`)
}

const directUserToLogin = (data) => {

  addAndRemoveHideClass([classReferences.create_new_user_container], [classReferences.login_container, classReferences.login_message])
  let message = `Success! New New user ${data.username} has been created! Please login below!`

  $('.login-message').html(message)


}



//const getStudyGuideData

//this function watches for user to click create new user, it then takes values supplied and passes it
//to a function that will make a post request to /users to create a new user

const watchForShowCreateNewUserFormClick = () => {
    $('.show-create-user-button').on('click', event => {
        event.preventDefault();

        $('#first-name').val('')
        $('#last-name').val('')
        $('#username').val('')
        $('#password').val('')
        $('login-message').val('')

        addAndRemoveHideClass([classReferences.login_container], [classReferences.create_new_user_container])
    })
}

const watchForShowLoginFormClick = () => {
    $('.show-login-page-button').on('click', event => {
        event.preventDefault();
        addAndRemoveHideClass([classReferences.create_new_user_container], [classReferences.login_container], )
    })
}
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




const init = () => {
    watchForCreateNewUserClick();
    watchForLoginClick();
    watchForShowCreateNewUserFormClick();
    watchForShowLoginFormClick();


}

$(init);
