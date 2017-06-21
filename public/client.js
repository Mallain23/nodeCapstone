const Urls = {

  CREATE_USER_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome',
  USER_COURSES_URL: '/user-data/courses',
  RESOURCE_DATA_URL: '/resources',
  USER_RESOURCES_URL: '/user-data/resources'
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

const handlePopup = (showPopArr, hidePopArr) => {
    showPopArr.forEach(element => {
        $(element).fadeIn('slow');
    })

    hidePopArr.forEach(element => {
      $(element).fadeOut();
    })

}


const makeRequestToAddNewClass = (course, callback) => {

  let settings = {
    url: Urls.USER_COURSES_URL,
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
    url: Urls.USER_COURSES_URL,
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

const makeRequestToAddNewResourceToResourceDatabase = (title, type, course, content, callback) => {

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

const makeRequestToAddNewResourceToUserDatabase = ({title, type, course, content, id, publishedOn, username}) => {
  console.log("here we are", id)
  let settings = {
    url: Urls.USER_RESOURCES_URL,
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
        uploadedResource: { username: 'Test2',
        content: content,
        title: title,
        type: type,
        course: course,
        publishedOn: publishedOn,
        resourceId: id }
      }),
      success: updateForResourceAdd
  }

$.ajax(settings)

}

const makeRequestToDeleteResourceFromUserDataBase = (resourceName, callback) => {
    let settings = {
      url: Urls.USER_RESOURCES_URL,
      contentType: 'application/json',
      method: 'DELETE',
      data: JSON.stringify({
            uploadedResources: resourceName,
            username: 'Test2'
        }),
        success: callback
    }

    $.ajax(settings)

}


//makeRequestToDeleleResourceFromResourceDataBase(resourceName)

const displayClasses = (data) => {
     Object.assign(state, data)

     if (state.currentClasses.length < 1) {
        message = "You have not added any classes yet, click add new class to add a class!"
        $('.current-classes-container').html(message)

        return
    }

    let formattedHtml = state.currentClasses.map(course => `<div class="${course.courseName}-container course-styles"><div class="name-of-course">Course Name: ${course.courseName}</div> <div class="number-of-resources">Number of Resources: ${course.resources.length}</div><button type="submit" value="${course.courseName}" class="view-course-resources-button">View Resources</button><button type='submit' value="${course.courseName}" class='remove-course-button'>Remove Course</button></div>`)

    $('.current-classes-container').html(formattedHtml)

    return
}

const updateForResourceAdd = (data) => {
    console.log(data)
    alert(`Sucess! Your resource ${data.title} has been added to the database!`)
    handlePopup([], [classReferences.create_new_resource_window])


}

const saveResourcesToState = data => {
  Object.assign(state, data)
  console.log(state)
}



const displayResources = data => {
    if (data) {
        Object.assign(state, data)
    }

    let html = state.uploadedResources.map(resource => `<div class="${resource.title}-container resource-styles"><div class="name-of-resource">Course Name: ${resource.title}</div> <div class="resource-course-name">Class: ${resource.course}</div><div class="heading-for-resource-type">Type of Resource: ${resource.type}</div><div class="resource-published-date">Published Date: ${resource.publishedOn}</div><button type="submit" value="${resource.title} class="edit-resource-button">Edit Resource</button><button type='submit' value="${resource.title}" class='delete-resource-button'>Delete Resource</button></div>`)
    $('.uploaded-resources-container').html(html)

}

const watchForShowAddNewClassFormClick = () => {
    $('.add-a-course-button').on('click', event => {
      event.preventDefault()

      addAndRemoveHideClass([classReferences.message_box], [])
      handlePopup([classReferences.add_a_course_container], [])

    })
}

const watchForCancelClick = () => {
    $('.cancel-button').on('click', event => {
          event.preventDefault()
          handlePopup([], [classReferences.add_a_course_container, classReferences.create_new_resource_window])

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

          handlePopup([], [classReferences.add_a_course_container])
          makeRequestToAddNewClass(courseName, displayClasses)
    })
}

const watchForDeleteClassClick = () => {
    $('.current-classes-container').on('click', ".remove-course-button", event => {
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

        handlePopup([classReferences.create_new_resource_window], [])
    })
}

const watchForCreateNewResourceSubmitClick = () => {
    $('.add-resource-submit').on("click", event => {

        let courseName = $('#resource-course').val()
        let resourceType = $('#type-of-resource').val()
        let resourceContent = $('#new-resource-content').val()
        let resourceTitle = $('#new-resource-title').val()


        makeRequestToAddNewResourceToResourceDatabase(resourceTitle, resourceType, courseName, resourceContent, makeRequestToAddNewResourceToUserDatabase)

    })
}

const watchForRetrieveSavedResourcesClick = () => {
    $('.edit-existing-resource-button').on('click', event => {

        addAndRemoveHideClass([classReferences.dashboard_page, classReferences.create_new_resource_window], [classReferences.my_uploaded_resources_page])
        displayResources()
})
}

const watchForDeleteSavedResourcesClick = () => {
    $('.uploaded-resources-container').on('click', '.delete-resource-button', event => {
     let resourceName = $(event.target).val()

      makeRequestToDeleteResourceFromUserDataBase(resourceName, displayResources)
      makeRequestToDeleleResourceFromResourceDataBase(resourceName)
    })
}
const init = () => {

    watchForShowAddNewClassFormClick();
    watchForCancelClick();
    watchForAddNewClassClick();
    watchForDeleteClassClick();
    watchForCreateNewResourceClick();
    watchForCreateNewResourceSubmitClick();
    //renderDashBoard();
    watchForRetrieveSavedResourcesClick();
    watchForDeleteSavedResourcesClick();

}

$(init);
