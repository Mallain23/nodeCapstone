const Urls = {

  USER_COURSES_URL: '/user-data/courses',
  RESOURCE_DATA_URL: '/resources',
  USER_RESOURCES_URL: '/user-data/resources',
  USER_FAVORITE_RESOURCES_URL: '/user-data/favorite-resources',
  USER_PROFILE: '/user-data/user-profile'
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
  view_my_favorite_resource_page: '.view-my-favorite-resource-page',
  current_classes_container: '.current-classes-container',
  search_for_resource_form: '.search-for-resource-form',
  show_form_button: '.show-form-button',
  favorite_resources_message_box: '.favorite-resources-message-box',
  favorite_resources_container: '.favorite-resources-container',
  prev_next_container: '.prev-next-container'
}

const NUMBER_OF_RESOURCES_PER_PAGE = 12

//adds hide class to elements in array of 1st param, removes hide class for elements in array of second param
const addAndRemoveHideClass = (addArray, removeArray) => {

    addArray.forEach(element => {
        $(element).addClass('hide')
    })

    removeArray.forEach(element => {
        $(element).removeClass('hide')
    })
};

const clearSearchForm = () => {
    $('#search-resource-title').val('')
    $('#search-resource-course').val('')
    $('#search-resource-username').val('')
    $('#search-resource-type').val('')
};

const clearNewResourceForm = () => {

  $('#resource-course').val('')
  $('#type-of-resource').val('')
  $('#new-resource-content').val('')
  $('#new-resource-title').val('')
}
