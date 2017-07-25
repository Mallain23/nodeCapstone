const makeRequestToAddResourcetoUserFavorites = data => {

    const {title, content, typeOfResource, publishedOn, id, author, course} = data[0]
    const { currentClasses, username } = state

    if (currentClasses.every(({ courseName }) => courseName !== course)) {
        return alert(`Course "${course}" must be added to your classboard before you can add a favorite resource to the course!`)
    }

    const settings = {
        url: Urls.USER_FAVORITE_RESOURCES_URL,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            username,
            author,
            content,
            title,
            typeOfResource,
            course,
            publishedOn,
            resourceId: id
        }),
        success: updateForFavoriteResourceAdd
    };

    $.ajax(settings)
};

//makes request to delete a resource from favorite resources
const makeRequestToDeleteFavoriteResource = (resourceId, courseName, success) => {

    const { username } = state
    const settings = {
        url: `${Urls.USER_FAVORITE_RESOURCES_URL}/${resourceId}`,
        contentType: 'application/json',
        method: 'DELETE',
        data: JSON.stringify({
            username,
            courseName
        }),
        success
    };

    $.ajax(settings)
};

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

    return  courseObject.resources.map(({ title, course, typeOfResource, publishedOn, resourceId, author }) => {

        return `<div class="${title}-container resource-styles">
                <div class="info-container info-container-resources"><span class="name-of-resource">Title: ${title}</span><br><br>
                <span class="name-of-author">Author: ${author}</span><br><br>
                <span class="resource-course-name">Course: ${course}</span><br><br>
                <span class="heading-for-resource-type">${typeOfResource}</span><br><br>
                <span class="resource-published-date">Published Date: ${publishedOn}</span></div>
                <div class="resource-button-container">
                <button type='submit' value='${resourceId}' class='view-resource-button btn btn-sm button-style-black'>View Resource</button><br>
                <button type='submit' value="${resourceId}" class='delete-resource-button btn btn-sm button-style-black'>Remove Resource</button></div></div>`
        })
};

const formatHtmlButtonsForFavoriteDisplay = resourceId => {
    return `<button class='go-back-to-my-favorite-resources-page btn button-style-black' type='submit'>Go Back!</button>`
};

//displays favorite resource for a course (using global variable to identify which course)
const displayFavoriteResources = courseName => {
    const { firstName, lastName, currentClasses } = state

    $('.favorite-resources-header').text(`${firstName} ${lastName}'s Favorite Resources`)

    const courseObject =  currentClasses.find(({ courseName: _courseName }) => _courseName === courseName)

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


const displaySelectedFavoriteToView = ({ title, content, course, typeOfResource, publishedOn, resourceId, author }) => {
    console.log(author)
    const html =  formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, resourceId, author)
    const buttonHtml = formatHtmlButtonsForFavoriteDisplay(resourceId)

    $('.my-favorite-resource-container').html(html)
    $('.resource-button-box').html(buttonHtml)
};

//checks to see if resource is already in favorites, if not makes request to user database to add to user favorites
const checkIfResourceShouldBeAddedToFavorites = resourceId => {
    const { currentClasses } = state

    if (currentClasses.some(({ resources }) => resources.some(({ resourceId: _resourceId }) => _resourceId  === resourceId))) {

        return alert('This resource is already in your favorite resources! You can see your favorite resources from your classboard page!')
    };

    makeRequestToFindResources('', '', '', '', resourceId, makeRequestToAddResourcetoUserFavorites)
};


const watchForAddResourceToFavoritesClick = () => {
    $('.results-container').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        checkIfResourceShouldBeAddedToFavorites(resourceId)
    });

    $('.query-results-container').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        checkIfResourceShouldBeAddedToFavorites(resourceId)
     });

     $('.resource-button-box').on('click', '.add-to-my-favorites-button', event => {
        event.preventDefault();

        resourceId = $(event.target).val()
        checkIfResourceShouldBeAddedToFavorites(resourceId)
      });

      $('.query-resource-button-box').on('click', '.add-to-my-favorites-button', event => {
         event.preventDefault();

         resourceId = $(event.target).val()
         checkIfResourceShouldBeAddedToFavorites(resourceId)
       });
};

// this function watches for user to click to view favorite resources for a given course
// function takes what course user has clicked on and then makes call to display the favorites of that course

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

        const { currentClasses, currentSelectedCourse } = state
        const idOfCourseToView = $(event.target).val()

        const targetCourse = currentClasses.find(({ courseName }) => courseName === currentSelectedCourse)

        const targetResource = targetCourse.resources.find(({ resourceId }) => resourceId === idOfCourseToView)

        displaySelectedFavoriteToView(targetResource);
    })
};

//this function watches for user to click to remove a course from their favorites, and makes a call to update user
//database and with callback function to displauy results
const watchForRemoveCourseFromFavoritesClick = () => {
    $('.favorite-resources-container').on('click','.delete-resource-button', event => {
        event.preventDefault()

        const { currentSelectedCourse } = state
        const resourceId = $(event.target).val()
        makeRequestToDeleteFavoriteResource(resourceId, currentSelectedCourse, updateForFavoriteResourceRemoval)
    })
};

const watchForGoBackToMyFavoriteResourcesPageClick = () => {
    $('.resource-button-box').on('click', '.go-back-to-my-favorite-resources-page', event =>{
        event.preventDefault()

        addAndRemoveHideClass([classReferences.view_my_favorite_resource_page],[classReferences.my_favorite_resources_page])
    })
}
