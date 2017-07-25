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
