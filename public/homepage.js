//try to seperate into pages, file has logic for one page, make name of file descriptive
//move variables to state and move to sep file

const makeRequestToLogOut = success => {
  const settings = {
      url: '/logout',
      contentType: 'application/json',
      method: 'GET',
      success
  };

  $.ajax(settings)
};

const makeRequestToChangePassword = (currentPassword, newPassword, success) => {

    const { username } = state
    const settings = {
        url: '/users/change-password',
        contentType: 'application/json',
        method: 'POST',
        data: JSON.stringify({
            username,
            currentPassword,
            newPassword
        }),
        success
    };

    $.ajax(settings)
};



const redirectForLogOut = () => {
  alert("You have been logged out!")
  window.location.replace('/')
}


const passwordChangeHandler = data => {
    const { message } = data

    message ? alert(message) : alert('Your password has been successfully changed!')
}
//this section is the functions that watch for click events


const watchForLogOutClick = () => {
    $('.dropdown-menu').on('click', '.logout', event => {
        makeRequestToLogOut(redirectForLogOut)
    })
};

const watchForChangePasswordClick = () => {
    $('.change-password').on('click', event => {

        $('#current-password').val('')
        $('#new-password1').val('')
        $('#new-password2').val('')
    })
};

const watchForChangePasswordSubmit = () => {
    $('.change-password-button').on('click', event => {

        const currentPassword = $('#current-password').val()
        const newPassword1 = $('#new-password1').val()
        const newPassword2 = $('#new-password2').val()

        if (newPassword1 !== newPassword2) {
            return alert("New passwords do no match, please try again!")
      }

        makeRequestToChangePassword(currentPassword, newPassword1, passwordChangeHandler)
        $('#change-password').modal('hide')
    })
};

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
    watchForFilterChange()
    handleScroll()
}

$(init);
