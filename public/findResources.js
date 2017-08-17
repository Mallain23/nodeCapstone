const makeRequestToFindResources = (title, course, typeOfResource, author, resourceId, callback) => {

    const settings = {
        url: `${Urls.RESOURCE_DATA_URL}?title=${title}&course=${course}&typeOfResource=${typeOfResource}&author=${author}&_id=${resourceId}`,
        contentType: 'application/json',
        method: 'GET',
        success: callback
    };

    $.ajax(settings)
};

//this function displays single resource from query results. Calls on function from
//resource file to format buttons and text html bc it is the same function used to format
//html used to view users own resources
const displayResourceFromQueryResults = data => {

    const {title, course, typeOfResource, content, publishedOn, id, author} = data[0]

    const html = formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, id, author)
    const buttonHtml = formatHtmlButtonsForResultDisplay(resourceId)

    $(window).scrollTop()
    $('.query-results-container').html(html)
    $('.query-resource-button-box').html(buttonHtml)
};



// this function formats html that displays the results when user searches for resources
const formatSearchResultHtml = data => {

    return data.map(({ title, course, publishedOn, typeOfResource, id, author }) =>  {

        return `<div class="${title}-container resource-styles"><div class="info-container info-container-resources">
                <span class="name-of-resource">Title: ${title}</span><br><br>
                <span class="name-of-author">Author: ${author}</span><br><br>
                <span class="resource-course-name">Course: ${course}</span><br><br><span class="heading-for-resource-type">${typeOfResource}</span><br><br>
                <span class="resource-published-date">Published Date: ${publishedOn}</span></div>
                <div class="resource-button-container">
                <button type='submit' value='${id}' class='view-resource-button btn button-style-black query-result-button'>View Resource</button>
                <button type='submit' value='${id}' class='add-to-my-favorites-button btn button-style-black query-result-button'>Add to Favorites</button></div></div>`
    })
};

//this function is called once search data is recieved back from server, and then sorted
const displaySearchResults = () => {
    const { searchResults, searchPageIndex } = state
    const arrayOfResultsToDisplayOnPage = searchResults.slice(searchPageIndex * NUMBER_OF_RESOURCES_PER_PAGE, (searchPageIndex * NUMBER_OF_RESOURCES_PER_PAGE) + NUMBER_OF_RESOURCES_PER_PAGE)


    const isOnLastFullPage = (searchPageIndex + 1 === Math.floor(searchResults.length / NUMBER_OF_RESOURCES_PER_PAGE) && !(searchResults.length % NUMBER_OF_RESOURCES_PER_PAGE));
    const isOnNonFullPage = arrayOfResultsToDisplayOnPage.length < NUMBER_OF_RESOURCES_PER_PAGE;

    isOnLastFullPage || isOnNonFullPage  ?  $(".go-to-next-page").attr("disabled", "disabled") : $(".go-to-next-page").removeAttr("disabled")
    searchPageIndex < 1 ?  $(".go-to-prev-page").attr("disabled", "disabled") : $(".go-to-prev-page").removeAttr("disabled")

    addAndRemoveHideClass([''], [classReferences.prev_next_container])

    const html = formatSearchResultHtml(arrayOfResultsToDisplayOnPage)
    const pageNum = searchPageIndex + 1;

    $('.results-container').html(html)
    $('.page').text(pageNum)
};


const displayPriorPageOfSearchResults = () => {

    state.searchPageIndex--
    const { searchPageIndex, searchResults } = state

    searchPageIndex < 1 ?  $(".go-to-prev-page").attr("disabled", "disabled") : $(".go-to-prev-page").removeAttr("disabled")
    $(".go-to-next-page").removeAttr("disabled")

    const arrayOfResultsToDisplayOnPage = searchResults.slice(searchPageIndex * NUMBER_OF_RESOURCES_PER_PAGE, (searchPageIndex * NUMBER_OF_RESOURCES_PER_PAGE) + NUMBER_OF_RESOURCES_PER_PAGE)
    const html = formatSearchResultHtml(arrayOfResultsToDisplayOnPage)
    const pageNum = searchPageIndex + 1;

    $('.results-container').html(html)
    $('.page').text(pageNum)
};


//this is a constant that used an enumeration function to create an object, the object contains the sort options
//which is used in the sort results function
const SortOptionMap = enumeration(['date_newest', 'date_oldest', 'title', 'author', 'course', 'typeOfResource'])

//this function sorts the search results before displaying them to user, user chooses how results should be sortd and
//based on users choice - this function will sort appropriately
const sortResults = () => {
   const { sortProperty } = state

    switch(sortProperty) {
      case SortOptionMap.title:
          state.searchResults = basicSort(state.searchResults, SortOptionMap.title)

          break;

      case SortOptionMap.author:
          state.searchResults = basicSort(state.searchResults, SortOptionMap.author)

        break;

      case SortOptionMap.course:

          state.searchResults = basicSort(state.searchResults, SortOptionMap.course)

          break;

      case SortOptionMap.typeOfResource:
          state.searchResults = basicSort(state.searchResults, SortOptionMap.typeOfResource);

          break;

      case SortOptionMap.date_newest:
         state.searchResults.reverse()

         break;
    }

     displaySearchResults()
}

// this function recieves data from server, if no searchr results will let user know, if there are results, will save
//and then call sort function to sort appropriately
const storeSearchResults = data => {
    if (data.length < 1) {

        return $('.results-container').text('Sorry, your search terms were too narrow and have not returned any results. Try refining your search terms!')
    }

    state.searchResults = data;
    sortResults()
};



const watchForSearchForResourcesClick = () => {
    $('.search-for-resource-button').on('click', event => {
        event.preventDefault();

        clearSearchForm()
        $('.results-container').text('');

        addAndRemoveHideClass([classReferences.prev_next_container, classReferences.view_my_resource_page, classReferences.view_my_favorite_resource_page, classReferences.view__result_from_search_page, classReferences.my_favorite_resources_page, classReferences.my_uploaded_resources_page, classReferences.edit_resource_page, classReferences.create_new_resource_window, classReferences.dashboard_page], [classReferences.find_resource_page])
    })
};

//this function watches for submit of search for resources and calls function to sent request to server
const watchForSearchForResourcesSubmitClick = () => {
    $('.search-resource-submit').on('click', event => {
        event.preventDefault();

        state.searchPageIndex = 0;
        $(".go-to-prev-page").attr("disabled", "disabled")

        const searchTitle = $('#search-resource-title').val()
        const searchCourse = $('#search-resource-course').val()
        const searchUser = $('#search-resource-username').val()
        const searchType = $('#search-resource-type').val()
        state.sortProperty = $('#sort-resources').val()

        if (searchTitle === '' && searchCourse === '' && searchUser === '' && searchType === '') {
            return alert('You must choose at least one filter before searching!')
        }

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
        addAndRemoveHideClass([classReferences.view__result_from_search_page, classReferences.show_form_button], [classReferences.find_resource_page, classReferences.search_for_resource_form])
    })
};


//watches for user to click to add a resource to their favorite resources, will get the resoruce id and then
//make a call to find the resource by resource id, once it gets that resource it will make request to add it to user favorites

const watchForHideFormClick = () => {
    $('.hide-form-button').on('click', event => {
        addAndRemoveHideClass([classReferences.search_for_resource_form], [classReferences.show_form_button])
    })
};

const watchForShowFormClick = () => {
    $('.show-form-button').on('click', event => {
        addAndRemoveHideClass([classReferences.show_form_button], [classReferences.search_for_resource_form])
    })
};

const watchForGoToNextPageOfResultsClick = () => {
    $('.go-to-next-page').on('click', event => {
        state.searchPageIndex++
        displaySearchResults()

        $(".results-container").scrollTop(0);
    })
};

const watchForGoToPreviousPageOfResultsClick = () => {
    $('.go-to-prev-page').on('click', event => {

          displayPriorPageOfSearchResults();

          $(".results-container").scrollTop(0);
          $(".go-to-next-page").removeAttr("disabled")
    })
};

const watchForFilterChange = () =>{
    $('#sort-resources').on('change', event => {
          console.log("s")
          event.preventDefault();

          state.searchPageIndex = 0;
          $(".go-to-prev-page").attr("disabled", "disabled")

          const searchTitle = $('#search-resource-title').val()
          const searchCourse = $('#search-resource-course').val()
          const searchUser = $('#search-resource-username').val()
          const searchType = $('#search-resource-type').val()
          state.sortProperty = $('#sort-resources').val()
          console.log(state.sortProperty)
          if (searchTitle === '' && searchCourse === '' && searchUser === '' && searchType === '') {
              return alert('You must choose at least one filter before searching!')

          }

          makeRequestToFindResources(searchTitle, searchCourse, searchType, searchUser, '', storeSearchResults)
    })
}
