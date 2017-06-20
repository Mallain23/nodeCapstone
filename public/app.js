//contains URLS for API calls
const Urls = {

  CREATE_USER_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome',
 USER_DATA_URL: '/user-data',
 RESOURCE_DATA_URL: '/resources'
};

const classReferences = {
  dashboard_page: '.dashboard-page',
  current_classes_page: '.current-classes-page',
  prior_classes_page: '.prior-classes-page',
  my_saved_resources_page: '.my-saved-resources-page',
  my_uploaded_resources_page: '.my-uploaded-resources-page',
  add_a_course_container: '.add-a-course-container',
  create_new_resource_window: '.create-new-resource-window',
  message_box: '.message-box'
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
    method: 'GET',
    success: callback
  }

$.ajax(settings)
}

const makeRequestToAddNewClass = (course, callback) => {

  let settings = {
    url: Urls.USER_DATA_URL,
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
          currentClasses: {courseName: course, resources: []},
          username: 'Test2'
      }),
      success: callback
  }

$.ajax(settings)

}

const makeRequestToRemoveClass = (course, callback) => {
  let settings = {
    url: Urls.USER_DATA_URL,
    contentType: 'application/json',
    method: 'DELETE',
    data: JSON.stringify({
          currentClasses: {courseName: course},
          username: 'Test2'
      }),
      success: callback
  }

$.ajax(settings)

}

const makeRequestToAddNewResource = (title, type, course, content, callback) => {

      let settings = {
        url: Urls.RESOURCE_DATA_URL,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            username: 'Test2',
            content: content,
            title: title,
            type: type,
            course: course
          }),
          success: callback
      }

    $.ajax(settings)
  }

const displayClasses = (data) => {
     Object.assign(state, data)

     if (state.currentClasses.length < 1) {
        message = "You have not added any classes yet, click add new class to add a class!"
        $('.current-classes-container').html(message)

        return
    }

    let formattedHtml = state.currentClasses.map(course => `<div class="${course.courseName}-container course-styles"><div class="name-of-course">Course Name: ${course.courseName}</div> <div class="number-of-resources">Number of Resources: ${course.resources.length}</div><button class="${course.courseName}-view-button">View Resources</button><button type='submit' value="${course.courseName}" class='remove-class-button'>Remove Course</button></div>`)

    $('.current-classes-container').html(formattedHtml)

    return
}

const updateForResourceAdd = (data) => {
    state.uploadedResources.push(data)
    alert(`Sucess! Your resource ${data.title} has been added to the database!`)
    handlePopup('', classReferences.create_new_resource_window)


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
      resetState();

      let username = $('#login-username').val()
      let password = $('#login-password').val()

      makeRequestToLogin(username, password, displayClasses)
    })
}



const watchForShowAddNewClassFormClick = () => {
    $('.add-a-course-button').on('click', event => {
      event.preventDefault()

      addAndRemoveHideClass([classReferences.message_box], [])
      handlePopup(classReferences.add_a_course_container, '')

    })
}

const watchForCancelClick = () => {
    $('.add-course-cancel').on('click', event => {
        event.preventDefault()
        handlePopup('', classReferences.add_a_course_container)
    })
}

const watchForAddNewClassClick = () => {
    $('.add-course-submit').on('click', event => {
          event.preventDefault();

          addAndRemoveHideClass([classReferences.message_box], [])
          let courseName = $('#course-name').val()
          $('#course-name').val('')
          if (state.currentClasses.some(course => course.courseName === courseName)) {
              $('.message-box').text('Sorry, that class is already in your dashboard!')
              addAndRemoveHideClass([], [classReferences.message_box])
              return
          }

          handlePopup('', classReferences.add_a_course_container)
          makeRequestToAddNewClass(courseName, displayClasses)
    })
}

const watchForDeleteClassClick = () => {
    $('.current-classes-container').on('click', ".remove-class-button", event => {
          event.preventDefault()

          let courseName = $(event.target).val();
          makeRequestToRemoveClass(courseName, displayClasses)
    })
}

const watchForCreateNewResourceClick = () => {
    $('.create-new-resource-button').on('click', event => {
        event.preventDefault();

        $('#resource-course').val('')
        $('#type-of-resource').val('')
        $('#new-resource-content').val('')
        $('#new-resource-title').val('')

        handlePopup(classReferences.create_new_resource_window, '')
    })
}

const watchForCreateNewResourceSubmitClick = () => {
    $('.add-resource-submit').on("click", event => {

        let courseName = $('#resource-course').val()
        let resourceType = $('#type-of-resource').val()
        let resourceContent = $('#new-resource-content').val()
        let resourceTitle = $('#new-resource-title').val()


        makeRequestToAddNewResource(resourceTitle, resourceType, courseName, resourceContent, updateForResourceAdd)
    })
}
const init = () => {
    watchForCreateNewUserClick();
    watchForLoginClick();
    watchForShowAddNewClassFormClick();
    watchForCancelClick();
    watchForAddNewClassClick();
    watchForDeleteClassClick();
    watchForCreateNewResourceClick();
    watchForCreateNewResourceSubmitClick();

}

$(init);
