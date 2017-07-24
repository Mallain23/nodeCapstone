//try to seperate into pages, file has logic for one page, make name of file descriptive
//move variables to state and move to sep file



//we have two seperate databases we are working with. One of them holds all the resources that are uploaded, and
//is available for all users to search for resources. Users can only edit and delete resources in this database if they
//are the creators. There is also a user database which stores all the users, and resources that they have created,
//the courses they have added to their classboard, and favorite resoruces they have saved to their courses.

// const makeRequesToGetUserData = callback => {
//
//       let settings = {
//           url: Urls.USER_PROFILE,
//           contentType: 'application/json',
//           method: 'GET',
//           success: callback
//       };
//
//       $.ajax(settings)
//   };

//this function makes request to add a new class to users courseboard -
// const makeRequestToAddNewClass = (courseName, callback) => {
//     const { username } = state
//
//     let settings = {
//         url: Urls.USER_COURSES_URL,
//         contentType: 'application/json',
//         method: 'PUT',
//         data: JSON.stringify({
//             currentClasses: {courseName, resources: []},
//             username
//         }),
//         success: callback
//     };
//
//     $.ajax(settings)
// };
//
// //this function makes request to remove course from users courseboard
// const makeRequestToRemoveClass = (course, callback) => {
//     let settings = {
//         url: Urls.USER_COURSES_URL,
//         contentType: 'application/json',
//         method: 'DELETE',
//         data: JSON.stringify({
//             currentClasses: {courseName: course},
//             username: state.username
//         }),
//         success: callback
//     };
//
//     $.ajax(settings)
// };

// //This function makes a request to the RESOURCE database to add a new resource that user has created
// const makeRequestToAddNewResourceToResourceDatabase = (title, typeOfResource, course, content, callback) => {
//
//     let settings = {
//         url: Urls.RESOURCE_DATA_URL,
//         contentType: 'application/json',
//         method: 'POST',
//         data: JSON.stringify({
//             username: state.username,
//             content: content,
//             title: title,
//             typeOfResource: typeOfResource,
//             course: course
//         }),
//         success: callback
//     };
//
//     $.ajax(settings)
// };
//
// //after resource is added to the resource database we also add it to the user database
// const makeRequestToAddNewResourceToUserDatabase = ({title, typeOfResource, course, content, id, publishedOn, username}) => {
//
//     let settings = {
//         url: Urls.USER_RESOURCES_URL,
//         contentType: 'application/json',
//         method: 'PUT',
//         data: JSON.stringify({
//         myResources: { username: state.username,
//                       content: content,
//                       title: title,
//                       typeOfResource: typeOfResource,
//                       course: course,
//                       publishedOn: publishedOn,
//                       resourceId: id
//                     }
//         }),
//         success: updateForResourceAdd
//     };
//
//     $.ajax(settings)
// };
//
// //this function makes call to delete a resource from resource database
// const makeRequestToDeleleResourceFromResourceDataBase = (resourceId, callback) => {
//     let settings = {
//         url: `${Urls.RESOURCE_DATA_URL}/${resourceId}`,
//         contentType: 'application/json',
//         data: JSON.stringify({
//             username: state.username
//         }),
//         method: 'DELETE',
//         success: callback
//     };
//
//     $.ajax(settings)
// };
//
// //this function makes request to delete resource from userdata base
// const makeRequestToDeleteResourceFromUserDataBase = ({ _id }) => {
//     let settings = {
//         url: `${Urls.USER_RESOURCES_URL}/${_id}`,
//         contentType: 'application/json',
//         method: 'DELETE',
//         success: storeMyResourceData
//     };
//
//     $.ajax(settings)
// };
//
// //this function makes request to update the resource in the resource database
// const makeRequestToUpdateResourceDatabase = (resourceId, userame, content, title, typeOfResource, course, callback) => {
//
//     let settings = {
//         url: `${Urls.RESOURCE_DATA_URL}/${resourceId}`,
//         contentType: 'application/json',
//         method: 'PUT',
//         data: JSON.stringify({
//             username: state.username,
//             content: content,
//             title: title,
//             typeOfResource: typeOfResource,
//             course: course
//         }),
//         success: callback
//     };
//
//     $.ajax(settings)
// };
//
// //this function sends request to update the resource in the userdata base (since it is also saved there to associate it with user)
// const makeRequestToUpdateUserResource = ({content, title, typeOfResource, course, publishedOn, id}) => {
//
//     let settings = {
//         url: `${Urls.USER_RESOURCES_URL}/${id}`,
//         contentType: 'application/json',
//         method: 'PUT',
//         data: JSON.stringify({
//             myResources: { username: state.username,
//                           content: content,
//                           title: title,
//                           typeOfResource: typeOfResource,
//                           course: course,
//                           publishedOn: publishedOn,
//                           resourceId: id
//             }
//         }),
//         success: updateForResourceUpdate
//     };
//
//     $.ajax(settings)
// }

//this function makes request to find resources in the resource database
const makeRequestToFindResources = (title, course, typeOfResource, username, resourceId, callback) => {

    let settings = {
        url: `${Urls.RESOURCE_DATA_URL}?title=${title}&course=${course}&typeOfResource=${typeOfResource}&username=${username}&_id=${resourceId}`,
        contentType: 'application/json',
        method: 'GET',
        success: callback
    };

    $.ajax(settings)
};

//this function makes request to add resource to users favorites (makes sure user has
//added the class to their dashboard first)
const makeRequestToAddResourcetoUserFavorites = data => {

    let {title, content, typeOfResource, publishedOn, id, username, course} = data[0]
    const {username, currentClasses} = state

    if (state.currentClasses.every(({ courseName }) => courseName !== course)) {
        alert(`Course "${course}" must be added to your classboard before you can add a favorite resource to the course!`)

        return
    }

    let settings = {
        url: Urls.USER_FAVORITE_RESOURCES_URL,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
                          username: state.username,
                          content: content,
                          title: title,
                          typeOfResource: typeOfResource,
                          course: course,
                          publishedOn: publishedOn,
                          resourceId: id
        }),
        success: updateForFavoriteResourceAdd
    };

    $.ajax(settings)
};

//makes request to delete a resource from favorite resources
const makeRequestToDeleteFavoriteResource = (resourceId, courseName, callback) => {
    let settings = {
        url: `${Urls.USER_FAVORITE_RESOURCES_URL}/${resourceId}`,
        contentType: 'application/json',
        method: 'DELETE',
        data: JSON.stringify({
                      username: state.username,
                      courseName: courseName
        }),
        success: callback
    };

    $.ajax(settings)
};

const makeRequestToLogOut = callback => {
  let settings = {
      url: '/logout',
      contentType: 'application/json',
      method: 'GET',
      success: callback
  };

  $.ajax(settings)
};

const makeRequestToChangePassword = (currentPassword, newPassword, callback) => {

    let settings = {
        url: '/users/change-password',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
          username: state.username,
          currentPassword: currentPassword,
          newPassword: newPassword
      }),
      success: callback
  };

  $.ajax(settings)
  };


// functions that help display classes to class back-to-dashboard
// const formatHtmlForClassDisplay = () => {
//
//     return state.currentClasses.map(course => {
//
//         return `<div class="${course.courseName}-container course-styles"><div class="info-container">
//                 <span class="name-of-course">${course.courseName}</span><br>
//                 <span class="number-of-resources">Number of Resources: ${course.resources.length}</span><br></div>
//                 <button type="submit" value="${course.courseName}" class="view-course-resources-button btn-sm button-style">View Resources</button><br>
//                 <button type='submit' value="${course.courseName}" class='remove-course-button btn-sm button-style'>Remove Course</button></div>`
//         })
// };


//if this function gets data back from server, saves it to state. If user does not have any classes yet,
// we will display message saying so. If user does have classes, we will display the classes
// const displayClasses = data => {
//
//      if (data) {
//         Object.assign(state, data)
//     }
//     $('.welcome-header').text(`${state.firstName} ${state.lastName}'s Classboard`)
//
//      if (state.currentClasses.length < 1) {
//         message = "You currently do not have any classes added to your Classboard. Click 'add new course' to add a course!"
//
//         $('.message-box').html(message)
//         $('.current-classes-container').html('')
//
//         return
//     }
//
//     let html = formatHtmlForClassDisplay()
//
//     $('.current-classes-container').html(html)
//     $('.message-box').html('')
// };


const updateForFavoriteResourceAdd = data => {
    Object.assign(state, data)

    alert("Success! This resource has been added to your favorite resources!")
}

//if user deletes resouce it will update state, and update view to show resource deleted
const updateForFavoriteResourceRemoval = data => {
    Object.assign(state, data)

    displayFavoriteResources(state.currentSelectedCourse)
};

const formatFavoriteResourceHtml = courseObject => {

    return  courseObject.resources.map(resource => {


        return `<div class="${resource.title}-container resource-styles">
                <div class="info-container info-container-resources"><span class="name-of-resource">${resource.title}</span><br><br>
                <span class="resource-course-name">${resource.course}</span><br><br>
                <span class="heading-for-resource-type">${resource.typeOfResource}</span><br><br>
                <span class="resource-published-date">Published Date: ${resource.publishedOn}</span></div>
                <div class="resource-button-container">
                <button type='submit' value='${resource.resourceId}' class='view-resource-button btn btn-sm button-style-black'>View Resource</button><br>
                <button type='submit' value="${resource.resourceId}" class='delete-resource-button btn btn-sm button-style-black'>Remove Resource</button></div></div>`
        })
}

//displays favorite resource for a course (using global variable to identify which course)
const displayFavoriteResources = courseName => {
    $('.favorite-resources-header').text(`${state.firstName} ${state.lastName}'s Favorite Resources`)

    let courseObject =  state.currentClasses.find(course => course.courseName === courseName)

    if (courseObject.resources.length < 1) {
        let message = 'You do not have any favorite resources for this course!'

        $('.favorite-resources-message-box').text(message)
        $('.favorite-resources-container').html('')

        return
    }

    let html = formatFavoriteResourceHtml(courseObject)

    $('.favorite-resources-container').html(html)
    $('.favorite-resource-message-box').text('')

};


//const this function updates the HTML fields when user is viewing a resource either through their favorites or when they
//are doing a query.
const formatHtmlTextForResultDisplay = (title, content, course, typeOfResource, publishedOn, resourceId, username) => {
    return `<div class="info-container result-view-info-container"><div class="row"><div class="col-lg-12 small-style-box"><span class='view-resource-title small-style-box'>Title: ${title}</span></div></div>
            <div class="row"><div class="col-lg-12 small-style-box"><span class='view-resource-author small-style-box'>Author: ${username}</span></div></div>
            <div class="row"><div class="col-lg-12 small-style-box"><span class='view-resource-course small-style-box'>Course: ${course}</span></div></div>
            <div class="row"><div class="col-lg-12 small-style-box"><span class='view-resource-type small-style-box'>Type of Resource: ${typeOfResource}</span></div></div>
            <div class="row"><div class="col-lg-12 small-style-box"><span class='view-resource-publish-date small-style-box'>Publish Date: ${publishedOn}</span></div></div></div>
            <div class="row"><div class="col-lg-12"> <div class='view-resource-content large-style-box'>${content}</div><div></div>`
};

const formatHtmlButtonsForResultDisplay = resourceId => {
    return `<button class='go-back-button btn button-style-black' type='submit'>Go Back</button>
            <button class='add-to-my-favorites-button btn button-style-black' value="${resourceId}" type='submit'>Add to Favorites</button>`
}

const formatHtmlButtonsForFavoriteDisplay = resourceId => {
    return `<button class='go-back-to-my-favorite-resources-page btn button-style-black' type='submit'>Go Back!</button>`
}

const displaySelectedResourceToView = ({title, content, course, typeOfResource, publishedOn, resourceId, username}) => {

    let html =  formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, resourceId, username)
    let buttonHtml = formatHtmlButtonsForResultDisplay(resourceId)

    $('.my-resource-container').html(html)
    $('.resource-button-box').html(buttonHtml)
};


const displaySelectedFavoriteToView = ({title, content, course, typeOfResource, publishedOn, resourceId, username}) => {
    let html =  formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, resourceId, username)
    let buttonHtml = formatHtmlButtonsForFavoriteDisplay(resourceId)

    $('.my-favorite-resource-container').html(html)
    $('.resource-button-box').html(buttonHtml)
};

const displayResourceFromQueryResults = data => {
    console.log(data)
    let {title, course, typeOfResource, content, publishedOn, id, username} = data[0]

    let html = formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, id, username)
    let buttonHtml = formatHtmlButtonsForResultDisplay(resourceId)

    $('.query-results-container').html(html)
    $('.query-resource-button-box').html(buttonHtml)
};

//this function displays the resource for the user to edit
const displaySelectedResourceToEdit = ({title, content, course, typeOfResource}) => {

    $('#edit-resource-title').val(title);
    $('#edit-resource-course').val(course);
    $('#edit-type-of-resource').val(typeOfResource);
    $('#edit-resource-content').val(content);
};

//checks to see if course selection is null or if class has already been added

const formatSearchResultHtml = (data) => {

    return data.map(resource =>  {

        return `<div class="${resource.title}-container resource-styles"><div class="info-container info-container-resources">
                <span class="name-of-resource">${resource.title}</span><br><br>
                <span class="resource-course-name"> ${resource.course}</span><br><br><span class="heading-for-resource-type">${resource.typeOfResource}</span><br><br>
                <span class="resource-published-date">Published Date: ${resource.publishedOn}</span></div>
                <div class="resource-button-container">
                <button type='submit' value='${resource.id}' class='view-resource-button btn button-style-black query-result-button'>View Resource</button>
                <button type='submit' value='${resource.id}' class='add-to-my-favorites-button btn button-style-black query-result-button'>Add to Favorites</button></div></div>`
              })
}
//displays search results - if data array is zero in length, no data back - user needs to refine search
//otherwise will display results
const storeSearchResults = data => {
    if (data.length < 1) {
        $('.results-container').text('Sorry, your search terms were too narrow and have not returned any results. Try refining your search terms!')
        return
    }

    state.searchResults = data;
    displaySearchResults()
}

const displaySearchResults = ()=> {

    let resultArray = state.searchResults.slice(state.searchPageIndex * 12, (state.searchPageIndex * 12) + 12)

    resultArray.length < 12 ?  $(".go-to-next-page").attr("disabled", "disabled") : $(".go-to-next-page").removeAttr("disabled")
    state.searchPageIndex < 1 ?  $(".go-to-prev-page").attr("disabled", "disabled") : $(".go-to-prev-page").removeAttr("disabled")

    addAndRemoveHideClass([''], [classReferences.prev_next_container])

    let html = formatSearchResultHtml(resultArray)
    let pageNum = state.searchPageIndex + 1;

    $('.results-container').html(html)
    $('.page').text(pageNum)

};

const displayPriorPageOfSearchResults = () => {
    state.searchPageIndex = state.searchPageIndex - 1;

    state.searchPageIndex < 1 ?  $(".go-to-prev-page").attr("disabled", "disabled") : $(".go-to-prev-page").removeAttr("disabled")
    $(".go-to-next-page").removeAttr("disabled")

    let resultArray = state.searchResults.slice(state.searchPageIndex * 12, (state.searchPageIndex * 12) + 12)
    let html = formatSearchResultHtml(resultArray)
    let pageNum = state.searchPageIndex + 1;

    $('.results-container').html(html)
    $('.page').text(pageNum)

}


//checks to see if resource is already in favorites, if not makes request to user database to add to user favorites
const addResourceToFavorites = resourceId => {
    if (state.currentClasses.some(courses => courses.resources.some(resources => resources.resourceId  === resourceId))) {

        alert('This resource is already in your favorite resources! You can see your favorite resources from your classboard page!')

        return
    };

    makeRequestToFindResources('', '', '', '', resourceId, makeRequestToAddResourcetoUserFavorites)
}


const redirectForLogOut = () => {
  alert("You have been logged out!")
  window.location.replace('http://localhost:8080')
}

const passwordChangeHandler = data => {

    data.message ? alert(data.message) : alert('Your password has been successfully changed!')

}
//this section is the functions that watch for click events

//dashboard click is almost like home button - brigns users to there dashboard (classboard? ) which displays classes and allows them to add class
const watchForMyDashboardClick = () => {
    $('.home-button').on('click', event=> {
        event.preventDefault()

        displayClasses()
        addAndRemoveHideClass([classReferences.find_resource_page, classReferences.view_my_resource_page, classReferences.my_uploaded_resources_page, classReferences.edit_resource_page, classReferences.create_new_resource_window, classReferences.my_favorite_resources_page, classReferences.view__result_from_search_page], [classReferences.dashboard_page])
    })
};


//this watches for user to submit the class to be added to there dashboard, if class is already in there dashboard or if they dont choose a class they will recieve an alert


//this function watches for user to click to create a new resource, and pulls up the page to allow them to create a new resource



//this function watches for user to search for resources and brings up page to allow them to search
const watchForSearchForResourcesClick = () => {
    $('.search-for-resource-button').on('click', event => {
        event.preventDefault();

        clearSearchForm()
        $('.results-container').text('');

        addAndRemoveHideClass([classReferences.prev_next_container, classReferences.view_my_resource_page, classReferences.view_my_favorite_resource_page, classReferences.view__result_from_search_page, classReferences.my_favorite_resources_page, classReferences.my_uploaded_resources_page, classReferences.edit_resource_page, classReferences.create_new_resource_window, classReferences.dashboard_page], [classReferences.find_resource_page])
    })
}

//this function watches for submit of search for resources and calls function to sent request to server
const watchForSearchForResourcesSubmitClick = () => {
    $('.search-resource-submit').on('click', event => {
        event.preventDefault();

        sate.searchPageIndex = 0;
        $(".go-to-prev-page").attr("disabled", "disabled")

        let searchTitle = $('#search-resource-title').val()
        let searchCourse = $('#search-resource-course').val()
        let searchUser = $('#search-resource-username').val()
        let searchType = $('#search-resource-type').val()

        makeRequestToFindResources(searchTitle, searchCourse, searchType, searchUser, '', storeSearchResults)
    })
};

const watchForClearFormClick = () => {
    $('.clear-form').on('click', event => {

        event.preventDefault();
        clearSearchForm();
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
    $('.query-resource-button-box').on('click', '.go-back-button', event => {
        addAndRemoveHideClass([classReferences.view__result_from_search_page], [classReferences.find_resource_page])
    })
};


//watches for user to click to add a resource to their favorite resources, will get the resoruce id and then
//make a call to find the resource by resource id, once it gets that resource it will make request to add it to user favorites
const watchForAddResourceToFavoritesClick = () => {
    $('.results-container').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        addResourceToFavorites(resourceId)
    });

    $('.query-results-container').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        addResourceToFavorites(resourceId)
     });

     $('.resource-button-box').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        addResourceToFavorites(resourceId)
      });

      $('.query-resource-button-box').on('click', '.add-to-my-favorites-button', event => {
         event.preventDefault();

         resourceId = $(event.target).val()
         addResourceToFavorites(resourceId)
       });
};

// this function watches for user to click to view favorite resources for a given course
// function takes what course user has clicked on and then makes call to display the favorites of that course
//currentSelectedCourse is global variable that we use to track what course the user is viewing, when we make a call
//in function below for a single resource, we use this global variable again
const watchForViewFavoriteResourcesClick = () => {
    $('.current-classes-container').on('click', '.view-course-resources-button', event => {
        event.preventDefault()
        addAndRemoveHideClass([classReferences.dashboard_page], [classReferences.my_favorite_resources_page])

        state.currentSelectedCourse = $(event.target).val()
        displayFavoriteResources(state.currentSelectedCourse)
    })
};

//this function watches for click of a single favorite resource within a given course. Looks through the users current
//courses, to find the one that matches the currentSelectedCourse and then finds the resource that matches the ID that
//matches the id user has clicked on. Passses that info into displaySelectedResourceToView function
const watchForViewFavoriteResourceButtonClick = () => {
    $('.favorite-resources-container').on('click', '.view-resource-button', event => {
        event.preventDefault()
        addAndRemoveHideClass([classReferences.my_favorite_resources_page], [classReferences.view_my_favorite_resource_page])

         let idOfCourseToView = $(event.target).val()

         let targetCourse = state.currentClasses.find(course => course.courseName === currentSelectedCourse)
         let targetResource = targetCourse.resources.find(resource => resource.resourceId === idOfCourseToView)

         displaySelectedFavoriteToView(targetResource);
    })
};

//this function watches for user to click to remove a course from their favorites, and makes a call to update user
//database and with callback function to displauy results
const watchForRemoveCourseFromFavoritesClick = () => {
    $('.favorite-resources-container').on('click','.delete-resource-button', event => {
        event.preventDefault()

        let resourceId = $(event.target).val()
        makeRequestToDeleteFavoriteResource(resourceId, state.currentSelectedCourse, updateForFavoriteResourceRemoval)
    })
};

const watchForGoBackToMyFavoriteResourcesPageClick = () => {
    $('.resource-button-box').on('click', '.go-back-to-my-favorite-resources-page', event =>{
        event.preventDefault()
        console.log("right spot")
        addAndRemoveHideClass([classReferences.view_my_favorite_resource_page],[classReferences.my_favorite_resources_page])
    })
}

const watchForHideFormClick = () => {
    $('.hide-form-button').on('click', event => {
        addAndRemoveHideClass([classReferences.search_for_resource_form], [classReferences.show_form_button])
    })
}

const watchForShowFormClick = () => {
    $('.show-form-button').on('click', event => {
        addAndRemoveHideClass([classReferences.show_form_button], [classReferences.search_for_resource_form])
    })
}
const watchForGoToNextPageOfResultsClick = () => {
    $('.go-to-next-page').on('click', event => {
        state.searchPageIndex++
        displaySearchResults()

        $(".results-container").scrollTop(0);
    })
}

const watchForGoToPreviousPageOfResultsClick = () => {
    $('.go-to-prev-page').on('click', event => {

          displayPriorPageOfSearchResults();

          $(".results-container").scrollTop(0);
          $(".go-to-next-page").removeAttr("disabled")

    });
};

const watchForGoToNextPageOfResourcesClick = () => {
  $('.go-to-next-page-resource').on('click', event => {
      state.resourcePageIndex++
      displayResources()

      $(".uploaded-resources-container").scrollTop(0);
  })
}

const watchForGoToPreviousPageOfResourcesClick = () => {
    $('.go-to-prev-page-resource').on('click', event => {

          displayPriorPageOfResources();

         $(".uploaded-resources-container").scrollTop(0);
    });
};

const watchForLogOutClick = () => {
    $('.dropdown-menu').on('click', '.logout', event => {
        makeRequestToLogOut(redirectForLogOut)
    })
}

const watchForChangePasswordClick = () => {
    $('.change-password').on('click', event => {

        $('#current-password').val('')
        $('#new-password1').val('')
        $('#new-password2').val('')
    })
}
const watchForChangePasswordSubmit = () => {
    $('.change-password-button').on('click', event => {

        let currentPassword = $('#current-password').val()
        let newPassword1 = $('#new-password1').val()
        let newPassword2 = $('#new-password2').val()

        if (newPassword1 !== newPassword2) {
            return alert("New passwords do no match, please try again!")
      }

        makeRequestToChangePassword(currentPassword, newPassword1, passwordChangeHandler)
        $('#change-password').modal('hide')
    })

}

const init = () => {
    watchForChangePasswordClick ()
    watchForAddNewClassClick();
    watchForDeleteClassClick();
    watchForCreateNewResourceClick();
    watchForCreateNewResourceSubmitClick();
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
    watchForClearFormClick();
    watchForShowFormClick()
    watchForHideFormClick()
    makeRequesToGetUserData(saveDataToState);
    watchForGoToNextPageOfResultsClick();
    watchForGoToPreviousPageOfResultsClick();
    watchForGoToPreviousPageOfResourcesClick();
    watchForGoToNextPageOfResourcesClick();
    watchForLogOutClick()
    watchForChangePasswordSubmit()
}

$(init);
