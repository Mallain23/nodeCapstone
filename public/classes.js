// this function makes request to add new class to classboard
const makeRequestToAddNewClass = (courseName, success) => {

    const { username } = state
    const settings = {
        url: Urls.USER_COURSES_URL,
        contentType: 'application/json',
        method: 'PUT',
        data: JSON.stringify({
            currentClasses: {courseName, resources: []},
            username
        }),
        success
    };

    $.ajax(settings)
};

//this function makes request to remove course from users courseboard
const makeRequestToRemoveClass = (courseName, success) => {

    const { username } = state
    const settings = {
        url: Urls.USER_COURSES_URL,
        contentType: 'application/json',
        method: 'DELETE',
        data: JSON.stringify({
            currentClasses: {courseName},
            username
        }),
        success
    };

    $.ajax(settings)
};

//this function checks to see if user has selected a course to add, if course has been added, will then
//check to make sure course has not already been added, once it returns true, request to server is made
const checkToSeeIfWeShouldAddCourse = courseName => {
    if (courseName === null) {
        alert("You must choose a course before clicking 'add course'!")

        return false
    }

    if (state.currentClasses.some(({ courseName: _courseName }) => _courseName === courseName)) {

        $('.message-box').text('Sorry, that class is already in your dashboard!')
        addAndRemoveHideClass([], [classReferences.message_box])

        return false
    }

    return true
};

//dashboard click is almost like home button - brigns users to there dashboard (classboard? ) which displays classes and allows them to add class
const watchForMyDashboardClick = () => {
    $('.home-button').on('click', event=> {
        event.preventDefault()

        displayClasses()
        addAndRemoveHideClass([classReferences.find_resource_page, classReferences.view_my_resource_page, classReferences.my_uploaded_resources_page, classReferences.edit_resource_page, classReferences.create_new_resource_window, classReferences.my_favorite_resources_page, classReferences.view__result_from_search_page], [classReferences.dashboard_page])
    })
};

// once user clicks to add course, will check to see if we should add the course
//if course has not already been added, will make request to add
//saveDataToState and displayClasses is in LoadPage file
const watchForAddNewClassClick = () => {
    $('.add-course-submit').on('click', event => {
          event.preventDefault();

          addAndRemoveHideClass([classReferences.message_box], [])

          const courseName = $('#course-name').val()
          const shouldWeAdd = checkToSeeIfWeShouldAddCourse(courseName)

          $('#course-name').val('')

          if (shouldWeAdd) {
              makeRequestToAddNewClass(courseName, saveDataToState)
          }
    })
};

//watches for user to click to delete a course, and then it makes request to remove course
const watchForDeleteClassClick = () => {
    $('.current-classes-container').on('click', ".remove-course-button", event => {
          event.preventDefault()

          const courseName = $(event.target).val();
          makeRequestToRemoveClass(courseName, saveDataToState)
    })
};
