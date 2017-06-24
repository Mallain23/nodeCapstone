const Urls = {

  CREATE_USER_URL: '/users',
  WELCOME_SCREEN_URL:'/users/welcome',
  USER_COURSES_URL: '/user-data/courses',
  RESOURCE_DATA_URL: '/resources',
  USER_RESOURCES_URL: '/user-data/resources',
  USER_FAVORITE_RESOURCES_URL: '/user-data/favorite-resources'
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
  login_message: '.login-message',
  edit_resource_page: '.edit-resource-page',
  view_my_resource_page: '.view-my-resource-page',
  find_resource_page: '.find-resource-page',
  view__result_from_search_page: '.view-result-from-search-page',
  my_favorite_resources_page: '.my-favorite-resources-page',
  view_my_favorite_resource_page: '.view-my-favorite-resource-page'

}

const state = {
    currentClasses: [],
    myResources: []
};

let idOfResourceToUpdate

let currentSelectedCourse

const resetState = () => {
    state.username = null,
    state.firstName = null,
    state.lastName = null,
    state.currentClasses = [],
    state.myResources = []
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

const makeRequestToAddNewResourceToResourceDatabase = (title, typeOfResource, course, content, callback) => {

      let settings = {
        url: Urls.RESOURCE_DATA_URL,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            username: 'Test2',
            content: content,
            title: title,
            typeOfResource: typeOfResource,
            course: course
          }),
          success: callback
      }

    $.ajax(settings)
  }

const makeRequestToAddNewResourceToUserDatabase = ({title, typeOfResource, course, content, id, publishedOn, username}) => {

  let settings = {
    url: Urls.USER_RESOURCES_URL,
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
        myResources: { username: 'Test2',
                      content: content,
                      title: title,
                      typeOfResource: typeOfResource,
                      course: course,
                      publishedOn: publishedOn,
                      resourceId: id
                    }
      }),
      success: updateForResourceAdd
  }

$.ajax(settings)

}

const makeRequestToDeleleResourceFromResourceDataBase = (resourceId, callback) => {
  let settings = {
    url: `${Urls.RESOURCE_DATA_URL}/${resourceId}`,
    contentType: 'application/json',
    method: 'DELETE',
    success: callback
  }

  $.ajax(settings)

}
const makeRequestToDeleteResourceFromUserDataBase = ({_id}, callback) => {
    let settings = {
      url: `${Urls.USER_RESOURCES_URL}/${_id}`,
      contentType: 'application/json',
      method: 'DELETE',
      success: displayResources
    }

    $.ajax(settings)

}

const makeRequestToUpdateResourceDatabase = (resourceId, userame, content, title, typeOfResource, course, callback) => {
  let settings = {
    url: `${Urls.RESOURCE_DATA_URL}/${resourceId}`,
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
        username: 'Test2',
        content: content,
        title: title,
        typeOfResource: typeOfResource,
        course: course
      }),
      success: callback
  }

$.ajax(settings)
}

const makeRequestToUpdateUserResource = ({content, title, typeOfResource, course, publishedOn, id}) => {

  let settings = {
    url: `${Urls.USER_RESOURCES_URL}/${id}`,
    contentType: 'application/json',
    method: 'PUT',
    data: JSON.stringify({
        myResources: { username: 'Test2',
                      content: content,
                      title: title,
                      typeOfResource: typeOfResource,
                      course: course,
                      publishedOn: publishedOn,
                      resourceId: id
                    }
                  }),
      success: updateForResourceUpdate
  }

  $.ajax(settings)
}


const makeRequestToFindResources = (title, course, typeOfResource, username, resourceId, callback) => {

  let settings = {
    url: `${Urls.RESOURCE_DATA_URL}?title=${title}&course=${course}&typeOfResource=${typeOfResource}&username=${username}&_id=${resourceId}`,
    contentType: 'application/json',
    method: 'GET',
    success: callback
  }

$.ajax(settings)

}

const makeRequestToAddResourcetoUserFavorites = data => {
    let {title, content, typeOfResource, publishedOn, id, username, course} = data[0]

    if (state.currentClasses.every(className => className.courseName !== course)) {
        alert(`Resource Course: ${course} must be added to your classboard before you can add a favorite resource to the course!`)
        return
    }

    let settings = {
        url: Urls.USER_FAVORITE_RESOURCES_URL,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
                          username: 'Test2',
                          content: content,
                          title: title,
                          typeOfResource: typeOfResource,
                          course: course,
                          publishedOn: publishedOn,
                          resourceId: id
                      }),
          success: updateForFavoriteResourceAdd
      }

    $.ajax(settings)
}

const makeRequestToDeleteFavoriteResource = (resourceId, courseName, callback) => {
  let settings = {
    url: `${Urls.USER_FAVORITE_RESOURCES_URL}/${resourceId}`,
    contentType: 'application/json',
    method: 'DELETE',
    data: JSON.stringify({
                      username: 'Test2',
                      courseName: courseName}),
    success: callback
  }

  $.ajax(settings)
}

const displayClasses = data => {
     if (data) {
        Object.assign(state, data)
    };

     if (state.currentClasses.length < 1) {
        message = "You have not added any classes yet, click add new class to add a class!"
        $('.current-classes-container').html(message)

        return
    }

    let formattedHtml = state.currentClasses.map(course => `<div class="${course.courseName}-container course-styles"><div class="name-of-course">Course Name: ${course.courseName}</div> <div class="number-of-resources">Number of Resources: ${course.resources.length}</div><button type="submit" value="${course.courseName}" class="view-course-resources-button">View Resources</button><button type='submit' value="${course.courseName}" class='remove-course-button'>Remove Course</button></div>`)

    $('.current-classes-container').html(formattedHtml)

    return
}

const updateForResourceAdd = data => {

    Object.assign(state, data)

    displayResources();
    addAndRemoveHideClass([classReferences.create_new_resource_window], [classReferences.my_uploaded_resources_page])

    alert(`Sucess! Your resource '${data.myResources[data.myResources.length - 1].title}' has been added to the database!`)
}

const updateForResourceUpdate = data => {
  Object.assign(state, data)

  displayResources();
  handlePopup([], [classReferences.create_new_resource_window])

  alert(`Sucess! Your resource has been updated!`)
}

const displayResources = data => {
    if (data) {
        Object.assign(state, data)
      }

    let html = state.myResources.map(resource => `<div class="${resource.title}-container resource-styles"><div class="name-of-resource">Resource Name: ${resource.title}</div> <div class="resource-course-name">Course: ${resource.course}</div><div class="heading-for-resource-type">Type of Resource: ${resource.typeOfResource}</div><div class="resource-published-date">Published Date: ${resource.publishedOn}</div><button type='submit' value='${resource.resourceId}' class='view-resource-button'>View Resource</button><button type='submit' value='${resource.resourceId}' class='edit-resource-button'>Edit Resource</button><button type='submit' value="${resource.resourceId}" class='delete-resource-button'>Delete Resource</button></div>`)
    $('.uploaded-resources-container').html(html)

}
const updateForFavoriteResourceAdd = data => {
    Object.assign(state, data)
    console.log(data)
    alert("Success! This resource has been added to your favorite resources!")
}

const updateForFavoriteResourceRemoval = data => {
    Object.assign(state, data)

    displayFavoriteResources(currentSelectedCourse)
}

const displayFavoriteResources = courseName => {

  let courseObject =  state.currentClasses.find(course => course.courseName === courseName)

  let html = courseObject.resources.map(resource => `<div class="${resource.title}-container resource-styles"><div class="name-of-resource">Resource Name: ${resource.title}</div> <div class="resource-course-name">Course: ${resource.course}</div><div class="heading-for-resource-type">Type of Resource: ${resource.typeOfResource}</div><div class="resource-published-date">Published Date: ${resource.publishedOn}</div><button type='submit' value='${resource.resourceId}' class='view-resource-button'>View Resource</button><button type='submit' value="${resource.resourceId}" class='delete-resource-button'>Remove Resource from Favorites</button></div>`)

  $('.favorite-resources-container').html(html)
}

const displaySelectedResourceToView = ({title, content, course, typeOfResource, publishedOn}) => {

  $('.view-resource-title').text(title)
  $('.view-resource-course').text(course)
  $('.view-resource-type').text(typeOfResource)
  $('.view-resource-content').text(content);
  $('.view-resource-publish-date').text(publishedOn)

}

const displayResourceFromQueryResults = data => {

  let {title, course, typeOfResource, content, publishedOn} = data[0]

  $('.view-resource-title').text(title)
  $('.view-resource-course').text(course)
  $('.view-resource-type').text(typeOfResource)
  $('.view-resource-content').text(content);
  $('.view-resource-publish-date').text(publishedOn)

}
const displaySelectedResourceToEdit = ({title, content, course, typeOfResource}) => {

    $('#edit-resource-title').val(title);
    $('#edit-resource-course').val(course);
    $('#edit-type-of-resource').val(typeOfResource);
    $('#edit-resource-content').val(content);
};

const displaySearchResults = data => {

  if (data.length < 1) {
      $('.results-container').text('Sorry, your search terms were too narrow and have not returned any results. Try refining your search terms!')
      return
  }

  let formattedHtml = data.map(resource => {
      return `<div class="${resource.title}-container resource-styles"><div class="name-of-resource">Resource Name: ${resource.title}</div> <div class="resource-course-name">Course: ${resource.course}</div><div class="heading-for-resource-type">Type of Resource: ${resource.typeOfResource}</div><div class="resource-published-date">Published Date: ${resource.publishedOn}</div><button type='submit' value='${resource.id}' class='view-resource-button'>View Resource</button><button type='submit' value='${resource.id}' class='add-to-my-favorites-button'>Add Resource to your Saved Resources</button></div>`
  })

    $('.results-container').html(formattedHtml)
}

//this section is the functions that watch for click events


//dashboard click is almost like home button - brigns users to there dashboard (classboard? ) which displays classes and allows them to add class
const watchForMyDashboardClick = () => {
    $('.home-button').on('click', event=> {
        event.preventDefault()

        displayClasses()
        addAndRemoveHideClass([classReferences.find_resource_page, classReferences.view_my_resource_page, classReferences.my_uploaded_resources_page, classReferences.edit_resource_page, classReferences.create_new_resource_window, classReferences.my_favorite_resources_page, classReferences.view__result_from_search_page], [classReferences.dashboard_page])
    })
}
//this function watches for add new class click, then pop up form to add class comes up
const watchForShowAddNewClassFormClick = () => {
    $('.add-a-course-button').on('click', event => {
        event.preventDefault()

        addAndRemoveHideClass([classReferences.message_box], [])
        handlePopup([classReferences.add_a_course_container], [])
    })
};
//this function watches for user to click cancel when adding calss, and closes add class window
const watchForCancelClick = () => {
    $('.cancel-button').on('click', event => {
          event.preventDefault()

          handlePopup([], [classReferences.add_a_course_container])
          addAndRemoveHideClass([])
    })
};

//this watches for user to submit the class to be added to there dashboard, if class is already in there dashboard or if they dont choose a class they will recieve an alert
const watchForAddNewClassClick = () => {
    $('.add-course-submit').on('click', event => {
          event.preventDefault();

          addAndRemoveHideClass([classReferences.message_box], [])

          let courseName = $('#course-name').val()

          if (courseName === null) {
            alert("You must choose a course before clicking 'add course'!")

            return
          }

          if (state.currentClasses.some(course => course.courseName === courseName)) {
              $('.message-box').text('Sorry, that class is already in your dashboard!')
              addAndRemoveHideClass([], [classReferences.message_box])

              return
          }

          $('#course-name').val('')
          handlePopup([], [classReferences.add_a_course_container])

          makeRequestToAddNewClass(courseName, displayClasses)
    })
};

//watches for user to click to delete a course, and then it makes request to remove course

const watchForDeleteClassClick = () => {
    $('.current-classes-container').on('click', ".remove-course-button", event => {
          event.preventDefault()

          let courseName = $(event.target).val();
          makeRequestToRemoveClass(courseName, displayClasses)
    })
};

//this function watches for user to click to create a new resource, and pulls up the page to allow them to create a new resource
const watchForCreateNewResourceClick = () => {
    $('.create-new-resource-button').on('click', event => {
        event.preventDefault();

        $('#resource-course').val('')
        $('#type-of-resource').val('')
        $('#new-resource-content').val('')
        $('#new-resource-title').val('')

        addAndRemoveHideClass([classReferences.my_uploaded_resources_page, classReferences.my_saved_resources_page, classReferences.my_favorite_resources_page, classReferences.dashboard_page, classReferences.edit_resource_page, classReferences.view_my_resource_page, classReferences.find_resource_page, classReferences.view__result_from_search_page], [classReferences.create_new_resource_window])
    })
}

//once user submits new resource this function gets the value of inputs and puts them in a function to make request to database to create resource
//the resource must be added to the resource data base and then to the userdata base (to associate resource with the user)
const watchForCreateNewResourceSubmitClick = () => {
    $('.add-resource-submit').on("click", event => {

          let courseName = $('#resource-course').val()
          let typeOfResource = $('#type-of-resource').val()
          let resourceContent = $('#new-resource-content').val()
          let resourceTitle = $('#new-resource-title').val()

          if (courseName === null || typeOfResource === null || resourceContent === null || resourceTitle === null) {
            alert('All fields are required! Please enter content for all fields before submitting')

            return
          }

          makeRequestToAddNewResourceToResourceDatabase(resourceTitle, typeOfResource, courseName, resourceContent, makeRequestToAddNewResourceToUserDatabase)
    })
};

//this function watches for user to click manage resources and will display that page and call the function to display the resources they have uploaded
const watchForRetrieveSavedResourcesClick = () => {
    $('.edit-existing-resource-button').on('click', event => {

        addAndRemoveHideClass([classReferences.dashboard_page, classReferences.create_new_resource_window, classReferences.my_favorite_resources_page, classReferences.edit_resource_page, classReferences.view_my_resource_page, classReferences.view_my_favorite_resource_page, classReferences.find_resource_page, classReferences.view__result_from_search_page], [classReferences.my_uploaded_resources_page])
        displayResources()
    })
};

//this function watches for user to click to delete a resource that they have uploaded, and calls function that will delete it from resource database and user database
const watchForDeleteSavedResourcesClick = () => {
    $('.uploaded-resources-container').on('click', '.delete-resource-button', event => {
        let resourceId = $(event.target).val()

        makeRequestToDeleleResourceFromResourceDataBase(resourceId, makeRequestToDeleteResourceFromUserDataBase)
    })
}

//this function watches for user to click to edit a resource they have uploaded, and then pulls up form to allow them to edit the resource
const watchForEditResourceClick = () => {
    $('.uploaded-resources-container').on('click', '.edit-resource-button', event => {
        idOfResourceToUpdate = $(event.target).val()

        let myResource = state.myResources.find(resource => resource.resourceId === idOfResourceToUpdate)

        displaySelectedResourceToEdit(myResource)

        addAndRemoveHideClass([classReferences.my_uploaded_resources_page], [classReferences.edit_resource_page])
    })
};

//once user has editted resource this watches for user to submit, gets the values for updated fields and calls function to make request to update
const watchForEditResourceSubmit = () => {
    $('.edit-resource-submit').on('click', event => {
          event.preventDefault();

          addAndRemoveHideClass([classReferences.edit_resource_page], [classReferences.my_uploaded_resources_page])

          let courseName = $('#edit-resource-course').val()
          let typeOfResource = $('#edit-type-of-resource').val()
          let resourceContent = $('#edit-resource-content').val()
          let resourceTitle = $('#edit-resource-title').val()

          if (courseName === null || typeOfResource === null || resourceContent === null || resourceTitle === null) {
              alert('All fields are required! Please enter content for all fields before submitting')

              return
          }

          makeRequestToUpdateResourceDatabase(idOfResourceToUpdate, state.username, resourceContent, resourceTitle, typeOfResource, courseName, makeRequestToUpdateUserResource)
    })
};

//this function watches for user to click button to view a specific resource they have uploaded
const watchForViewResourceClick = () => {
    $('.uploaded-resources-container').on('click', '.view-resource-button', event => {
          event.preventDefault();

          addAndRemoveHideClass([classReferences.my_uploaded_resources_page], [classReferences.view_my_resource_page])

          idOfResourceToUpdate = $(event.target).val()
          let myResource = state.myResources.find(resource => resource.resourceId === idOfResourceToUpdate)

          displaySelectedResourceToView(myResource);
    })
}

//this function watches for user to click to go back to the uploaded resource page (handles from edit or view resource)
const watchForGoBackToUploadedResourcesClick = () => {
    $('.go-back-to-my-uploaded-resource-page').on('click', event => {
          event.preventDefault()

          addAndRemoveHideClass([classReferences.view_my_resource_page, classReferences.edit_resource_page], [classReferences.my_uploaded_resources_page])
    })
}

//this function watches for user to search for resources and brings up page to allow them to search
const watchForSearchForResourcesClick = () => {
    $('.search-for-resource-button').on('click', event => {
        event.preventDefault();

        $('#search-resource-title').val('')
        $('#search-resource-course').val('')
        $('#search-resource-username').val('')
        $('#search-resource-type').val('')
        $('.results-container').text('');

        addAndRemoveHideClass([classReferences.view_my_resource_page, classReferences.view_my_favorite_resource_page, classReferences.view__result_from_search_page, classReferences.my_favorite_resources_page, classReferences.my_uploaded_resources_page, classReferences.edit_resource_page, classReferences.create_new_resource_window, classReferences.dashboard_page], [classReferences.find_resource_page])
    })
}

//this function watches for submit of search for resources and calls function to sent request to server
const watchForSearchForResourcesSubmitClick = () => {
    $('.search-resource-submit').on('click', event => {
        event.preventDefault();

        let searchTitle = $('#search-resource-title').val()
        let searchCourse = $('#search-resource-course').val()
        let searchUser = $('#search-resource-username').val()
        let searchType = $('#search-resource-type').val()

        makeRequestToFindResources(searchTitle, searchCourse, searchUser, searchType, '', displaySearchResults)
    })
};

//this function watches for user to click a specific resource to view and makes request to server to view that resource
const watchForViewResourceFromQueryResultsClick = () => {
    $('.results-container').on('click', '.view-resource-button', event => {
          event.preventDefault();

          addAndRemoveHideClass([classReferences.find_resource_page], [classReferences.view__result_from_search_page])

          resourceId = $(event.target).val()
          makeRequestToFindResources('', '', '', '', resourceId, displayResourceFromQueryResults)
    })
};

//if user clicks on a resources and wants to go back to results - this funciton watches for click and then brings them back
const watchForGoBackToFindResourcePageClick = () => {
    $('.go-back-to-find-resource-page').on('click', event => {
        addAndRemoveHideClass([classReferences.view__result_from_search_page], [classReferences.find_resource_page])
    })
};

//watches for user to click to add a resource to their favorite resources
const watchForAddResourceToFavoritesClick = () => {
    $('.results-container').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        makeRequestToFindResources('', '', '', '', resourceId, makeRequestToAddResourcetoUserFavorites)
    })
}

const watchForViewFavoriteResourcesClick = () => {
    $('.current-classes-container').on('click', '.view-course-resources-button', event => {
        event.preventDefault()

        currentSelectedCourse = $(event.target).val()
        addAndRemoveHideClass([classReferences.dashboard_page], [classReferences.my_favorite_resources_page])
        displayFavoriteResources(currentSelectedCourse)
    })
}

const watchForRemoveCourseFromFavoritesClick = () => {
    $('.favorite-resources-container').on('click','.delete-resource-button', event => {
        event.preventDefault()
        let resourceId = $(event.target).val()

        makeRequestToDeleteFavoriteResource(resourceId, currentSelectedCourse, updateForFavoriteResourceRemoval)
    })
}

const watchForViewFavoriteResourceButtonClick = () => {
    $('.favorite-resources-container').on('click', '.view-resource-button', event => {

        event.preventDefault()

        addAndRemoveHideClass([classReferences.my_favorite_resources_page], [classReferences.view_my_favorite_resource_page])

         let idOfCourseToView = $(event.target).val()

         let targetCourse = state.currentClasses.find(course => course.courseName === currentSelectedCourse)
         let targetResource = targetCourse.resources.find(resource => resource.resourceId === idOfCourseToView)

         displaySelectedResourceToView(targetResource);
    })
}

const watchForGoBackToMyFavoriteResourcesPageClick = () => {
    $('.go-back-to-my-favorite-resources-page').on('click', event =>{
        event.preventDefault()

        addAndRemoveHideClass([classReferences.view_my_favorite_resource_page],[classReferences.my_favorite_resources_page])
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
    watchForEditResourceClick();
    watchForEditResourceSubmit();
    watchForViewResourceClick();
    watchForGoBackToUploadedResourcesClick();
    watchForMyDashboardClick();
    watchForSearchForResourcesClick();
    watchForSearchForResourcesSubmitClick();
    watchForViewResourceFromQueryResultsClick();
    watchForGoBackToFindResourcePageClick();
    watchForAddResourceToFavoritesClick();
    watchForViewFavoriteResourcesClick();
    watchForRemoveCourseFromFavoritesClick();
    watchForViewFavoriteResourceButtonClick();
    watchForGoBackToMyFavoriteResourcesPageClick();


}

$(init);
