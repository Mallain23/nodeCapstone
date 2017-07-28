//This function makes a request to the RESOURCE database to add a new resource that user has created
const makeRequestToAddNewResourceToResourceDatabase = (title, typeOfResource, course, content, success) => {

    const { username } = state
    const settings = {
        url: Urls.RESOURCE_DATA_URL,
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            username,
            content,
            title,
            typeOfResource,
            course
        }),
        success
    };

    $.ajax(settings)
};

//after resource is added to the resource database we also add it to the user database
const makeRequestToAddNewResourceToUserDatabase = ({title, typeOfResource, course, content, id, publishedOn, author}) => {

    const settings = {
        url: Urls.USER_RESOURCES_URL,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            myResources: {
                author,
                content,
                title,
                typeOfResource,
                course,
                publishedOn,
                resourceId: id
            }
        }),
        success: updateStateAndDisplayForResourceAdd
    };

    $.ajax(settings)
};

//this function makes call to delete a resource from resource database
const makeRequestToDeleleResourceFromResourceDataBase = (resourceId, success) => {

    const { username } = state
    const settings = {
        url: `${Urls.RESOURCE_DATA_URL}/${resourceId}`,
        contentType: 'application/json',
        data: JSON.stringify({
            username
        }),
        method: 'DELETE',
        success
    };

    $.ajax(settings)
};

//this function makes request to delete resource from userdata base
const makeRequestToDeleteResourceFromUserDataBase = ({ _id }) => {

    const settings = {
        url: `${Urls.USER_RESOURCES_URL}/${_id}`,
        contentType: 'application/json',
        method: 'DELETE',
        success: storeMyResourceData
    };

    $.ajax(settings)
};

//this function makes request to update the resource in the resource database
const makeRequestToUpdateResourceDatabase = (resourceId, userame, content, title, typeOfResource, course, success) => {

    const { username } = state
    const settings = {
        url: `${Urls.RESOURCE_DATA_URL}/${resourceId}`,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            username,
            content,
            title,
            typeOfResource,
            course
        }),
        success
    };

    $.ajax(settings)
};

//this function sends request to update the resource in the userdata base (since it is also saved there to associate it with user)
const makeRequestToUpdateUserResource = ({content, title, typeOfResource, course, publishedOn, resourceId}) => {

    const { username } = state
    const settings = {
        url: `${Urls.USER_RESOURCES_URL}/${id}`,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            myResources: {
                username,
                content,
                title,
                typeOfResource,
                course,
                publishedOn,
                resourceId
            }
        }),
        success: updateStateAndDisplpayForResourceUpdate
    };

    $.ajax(settings)
};

const storeMyResourceData = data => {

    Object.assign(state, data)

    if (state.myResources.length < 1) {
       const messageHtml = "You do not currently have any resources uploaded to the database. Click 'Add New Resource to Database' to add a resource!"

       $('.resource-message-box').html(messageHtml)
       $('.uploaded-resources-container').html('')

       return
    }

    displayResources()
};

//once user adds a resource to databases, this function will save that resource to state, and then show the user
//a page with all of the resources they have managed (and update that page with new resource)
const updateStateAndDisplayForResourceAdd = data => {
    Object.assign(state, data)
    state.resourcePageIndex = 0

    const { myResources } = state

    displayResources();

    addAndRemoveHideClass([''], [classReferences.my_uploaded_resources_page])
    alert(`Sucess! Your resource '${myResources[myResources.length - 1].title}' has been added to the database!`)
};

const updateStateAndDisplpayForResourceUpdate = data => {
    Object.assign(state, data)
    state.resourcePageIndex = 0

    displayResources();

    alert(`Sucess! Your resource has been updated!`)
};


const formatMyResourceHtml = results => {

    return results.map(( { title, course, typeOfResource, publishedOn, resourceId, author}) => {

        return `<div class="${title}-container resource-styles"><div class="info-container info-container-resources">
                <span class="name-of-resource">Title: ${title}</span><br><br>
                <span class="name-of-author">Author: ${author}</span><br><br>
                <span class="resource-course-name">Course: ${course}</span><br><br>
                <span class="heading-for-resource-type">${typeOfResource}</span><br><br>
                <span class="resource-published-date">Published Date: ${publishedOn}</span></div>
                <div class="resource-button-container">
                <button type='submit' value='${resourceId}' class='view-resource-button btn-sm button-style-black'>View Resource</button><br>
                <button type='submit' value='${resourceId}' class='edit-resource-button btn-sm button-style-black' data-toggle='modal' data-target='#edit-resource'>Edit Resource</button><br>
                <button type='submit' value="${resourceId}" class='delete-resource-button btn-sm button-style-black'>Delete Resource</button></div></div>`
        })
};

const displayResources = () => {

    const { myResources, resourcePageIndex } = state

    const arrayOfResultsToDisplayOnPage = myResources.slice(resourcePageIndex * NUMBER_OF_RESOURCES_PER_PAGE, (resourcePageIndex * NUMBER_OF_RESOURCES_PER_PAGE) + NUMBER_OF_RESOURCES_PER_PAGE)

    const isOnLastFullPage = (resourcePageIndex + 1 === Math.floor(myResources.length / NUMBER_OF_RESOURCES_PER_PAGE) && !(myResources.length % NUMBER_OF_RESOURCES_PER_PAGE));
    const isOnNonFullPage = arrayOfResultsToDisplayOnPage.length < NUMBER_OF_RESOURCES_PER_PAGE;

  isOnLastFullPage || isOnNonFullPage ?  $(".go-to-next-page-resource").attr("disabled", "disabled") : $(".go-to-next-page-resource").removeAttr("disabled")
    resourcePageIndex < 1 ?  $(".go-to-prev-page-resource").attr("disabled", "disabled") : $(".go-to-prev-page-resource").removeAttr("disabled")

    addAndRemoveHideClass([''], [classReferences.prev_next_container])

    const html = formatMyResourceHtml(arrayOfResultsToDisplayOnPage)
    const pageNum = resourcePageIndex + 1;

    $('.uploaded-resources-container').html(html)
    $('.page').text(pageNum)
    $('.resource-message-box').html('')
};

const displayPriorPageOfResources = () => {
      state.resourcePageIndex--;
      const { resourcePageIndex, myResources } = state


      resourcePageIndex < 1 ?  $(".go-to-prev-page-resource").attr("disabled", "disabled") : $(".go-to-prev-page-resource").removeAttr("disabled")
      $(".go-to-next-page-resource").removeAttr("disabled")

      const arrayOfResultsToDisplayOnPage= myResources.slice(resourcePageIndex * NUMBER_OF_RESOURCES_PER_PAGE, (resourcePageIndex * NUMBER_OF_RESOURCES_PER_PAGE) + NUMBER_OF_RESOURCES_PER_PAGE)
      const html = formatMyResourceHtml(arrayOfResultsToDisplayOnPage)
      const pageNum = resourcePageIndex + 1;


      $('.uploaded-resources-container').html(html)
      $('.page').text(pageNum)
}

//const this function updates the HTML fields when user is viewing a resource either through their favorites or when they
//are doing a query.
const formatHtmlTextForResultDisplay = (title, content, course, typeOfResource, publishedOn, resourceId, author) => {
    return `<div class="info-container result-view-info-container"><div class="row"><div class="col-xs-12 small-style-box"><span class='view-resource-title'>Title: ${title}</span></div></div>
            <div class="row"><div class="col-xs-12 small-style-box"><span class='view-resource-author'>Author: ${author}</span></div></div>
            <div class="row"><div class="col-xs-12 small-style-box"><span class='view-resource-course'>Course: ${course}</span></div></div>
            <div class="row"><div class="col-xs-12 small-style-box"><span class='view-resource-type'>Type of Resource: ${typeOfResource}</span></div></div>
            <div class="row"><div class="col-xs-12 small-style-box"><span class='view-resource-publish-date'>Publish Date: ${publishedOn}</span></div></div></div>
            <div class="row"><div class="col-xs-12"> <div class='view-resource-content large-style-box'>${content}</div><div></div>`
};

const formatHtmlButtonsForResultDisplay = resourceId => {
    return `<button class='go-back-button btn button-style-black' type='submit'>Go Back</button>
            <button class='add-to-my-favorites-button btn button-style-black' value="${resourceId}" type='submit'>Add to Favorites</button>`
};


const displaySelectedResourceToView = ({title, content, course, typeOfResource, publishedOn, resourceId, author}) => {

    const html =  formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, resourceId, author)
    const buttonHtml = formatHtmlButtonsForResultDisplay(resourceId)

    $('.my-resource-container').html(html)
    $('.resource-button-box').html(buttonHtml)
};


//this function displays the resource for the user to edit
const displaySelectedResourceToEdit = ({title, content, course, typeOfResource}) => {

    $('#edit-resource-title').val(title);
    $('#edit-resource-course').val(course);
    $('#edit-type-of-resource').val(typeOfResource);
    $('#edit-resource-content').val(content);
};


//click events related to resources

const watchForCreateNewResourceClick = () => {
    $('.create-new-resource-button').on('click', event => {
        event.preventDefault();

        clearNewResourceForm()
        displayResources()

        addAndRemoveHideClass([classReferences.my_favorite_resources_page, classReferences.dashboard_page, classReferences.edit_resource_page, classReferences.view_my_resource_page, classReferences.find_resource_page, classReferences.view__result_from_search_page], [classReferences.my_uploaded_resources_page])
    })
};

//once user submits new resource this function gets the value of inputs and puts them in a function to make request to database to create resource
//the resource must be added to the resource data base and then to the userdata base (to associate resource with the user)
const watchForCreateNewResourceSubmitClick = () => {
    $('.add-resource-submit').on("click", event => {
          event.preventDefault()

          const courseName = $('#resource-course').val()
          const typeOfResource = $('#type-of-resource').val()
          const resourceContent = $('#new-resource-content').val()
          const resourceTitle = $('#new-resource-title').val()

          if (courseName === null || typeOfResource === null || resourceContent === null || resourceContent === "" || resourceTitle === null || resourceTitle === "") {
              return alert('All fields are required! Please fill out each field before submitting')
          }

          makeRequestToAddNewResourceToResourceDatabase(resourceTitle, typeOfResource, courseName, resourceContent, makeRequestToAddNewResourceToUserDatabase)
          $('#create-new-resource-container').modal('hide')
    })
};

//this function watches for user to click manage resources and will display that page and call the function to display the resources they have uploaded
const watchForRetrieveSavedResourcesClick = () => {
    $('.edit-existing-resource-button').on('click', event => {

        addAndRemoveHideClass([classReferences.dashboard_page, classReferences.create_new_resource_window, classReferences.my_favorite_resources_page, classReferences.edit_resource_page, classReferences.view_my_resource_page, classReferences.view_my_favorite_resource_page, classReferences.find_resource_page, classReferences.view__result_from_search_page], [classReferences.my_uploaded_resources_page])
        state.resourcePageIndex = 0
        storeMyResourceData()
    })
};

//this function watches for user to click to delete a resource that they have uploaded, and calls function that will delete it from resource database and user database
const watchForDeleteSavedResourcesClick = () => {
    $('.uploaded-resources-container').on('click', '.delete-resource-button', event => {

        const resourceId = $(event.target).val()
        state.resourcePageIndex = 0

        makeRequestToDeleleResourceFromResourceDataBase(resourceId, makeRequestToDeleteResourceFromUserDataBase)
    })
};

//this function watches for user to click to edit a resource they have uploaded, and then pulls up form to allow them to edit the resource
const watchForEditResourceClick = () => {
    $('.uploaded-resources-container').on('click', '.edit-resource-button', event => {

        state.idOfResourceToUpdate = $(event.target).val()
        const { idOfResourceToUpdate, myResources } = state

        const myResource = myResources.find(({ resourceId }) => resourceId === idOfResourceToUpdate)

        displaySelectedResourceToEdit(myResource)
    })
};

//once user has editted resource this function watches for user to submit, gets the values for updated fields and calls function to make request to update
const watchForEditResourceSubmit = () => {
    $('.edit-submit').on('click', event => {
          event.preventDefault();
          const { idOfResourceToUpdate, username } = state

          const courseName = $('#edit-resource-course').val().trim()
          const typeOfResource = $('#edit-type-of-resource').val().trim()
          const resourceContent = $('#edit-resource-content').val().trim()
          const resourceTitle = $('#edit-resource-title').val().trim()


          if (courseName === null || typeOfResource === null || resourceContent === null || resourceContent === "" || resourceTitle === null || resourceTitle === "") {
              return alert('All fields are required! Please enter content for all fields before submitting')
          }

          makeRequestToUpdateResourceDatabase(idOfResourceToUpdate, username, resourceContent, resourceTitle, typeOfResource, courseName, makeRequestToUpdateUserResource)
          $('#edit-resource').modal('hide')
    })
};

//this function watches for user to click button to view a specific resource they have uploaded
const watchForViewResourceClick = () => {
    $('.uploaded-resources-container').on('click', '.view-resource-button', event => {
          event.preventDefault();

          state.idOfResourceToUpdate = $(event.target).val()
          const { idOfResourceToUpdate, myResources } = state

          addAndRemoveHideClass([classReferences.my_uploaded_resources_page], [classReferences.view_my_resource_page])

          const myResource = myResources.find(({ resourceId }) => resourceId === idOfResourceToUpdate)

          displaySelectedResourceToView(myResource);
    })
};

//this function watches for user to click to go back to the uploaded resource page (handles from edit or view resource)
const watchForGoBackToUploadedResourcesClick = () => {
    $('.resource-button-box').on('click', '.go-back-button', event => {
          event.preventDefault()

          addAndRemoveHideClass([classReferences.view_my_resource_page, classReferences.edit_resource_page], [classReferences.my_uploaded_resources_page])
    });
};

const watchForGoToNextPageOfResourcesClick = () => {
    $('.go-to-next-page-resource').on('click', event => {

        state.resourcePageIndex++

        displayResources()
        $(".uploaded-resources-container").scrollTop(0);
  });
};

const watchForGoToPreviousPageOfResourcesClick = () => {
    $('.go-to-prev-page-resource').on('click', event => {

          displayPriorPageOfResources();

         $(".uploaded-resources-container").scrollTop(0);
    });
};
