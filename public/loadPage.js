//this function is called when page loads, it gets user data from database,
//and then calls saveDataToStateto save data to state and then calls displayClasses display users classes

const makeRequesToGetUserData = callback => {

    const settings = {
        url: Urls.USER_PROFILE,
        contentType: 'application/json',
        method: 'GET',
        success: callback
    };

    $.ajax(settings)
  };

const saveDataToState = data => {
    Object.assign(state, data)

    displayClasses()
}


const displayClasses = data => {

    const { firstName, lastName, currentClasses} = state

    $('.welcome-header').text(`${firstName} ${lastName}'s Classboard`)

    if (currentClasses.length < 1) {
          message = "You currently do not have any classes added to your Classboard. Click 'add new course' to add a course!"

          $('.message-box').html(message)
          $('.current-classes-container').html('')

          return
      }

      const html = formatHtmlForClassDisplay()

      $('.current-classes-container').html(html)
      $('.message-box').html('')
  };


const formatHtmlForClassDisplay = () => {
    const { currentClasses } = state

    return currentClasses.map(course => {

          return `<div class="${course.courseName}-container course-styles"><div class="info-container">
                  <span class="name-of-course">${course.courseName}</span><br>
                  <span class="number-of-resources">Number of Resources: ${course.resources.length}</span><br></div>
                  <button type="submit" value="${course.courseName}" class="view-course-resources-button btn-sm button-style">View Resources</button><br>
                  <button type='submit' value="${course.courseName}" class='remove-course-button btn-sm button-style'>Remove Course</button></div>`
          })
  };
