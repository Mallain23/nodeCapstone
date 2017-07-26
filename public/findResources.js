const makeRequestToFindResources = (title, course, typeOfResource, author, resourceId, callback) => {

    const settings = {
        url: `${Urls.RESOURCE_DATA_URL}?title=${title}&course=${course}&typeOfResource=${typeOfResource}&author=${author}&_id=${resourceId}`,
        contentType: 'application/json',
        method: 'GET',
        success: callback
    };

    $.ajax(settings)
};

const displayResourceFromQueryResults = data => {

    const {title, course, typeOfResource, content, publishedOn, id, author} = data[0]

    const html = formatHtmlTextForResultDisplay(title, content, course, typeOfResource, publishedOn, id, author)
    const buttonHtml = formatHtmlButtonsForResultDisplay(resourceId)

    $(window).scrollTop()
    $('.query-results-container').html(html)
    $('.query-resource-button-box').html(buttonHtml)
};


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


const displaySearchResults = ()=> {
    const { searchResults, searchPageIndex } = state
    const resultArray = searchResults.slice(searchPageIndex * 12, (searchPageIndex * 12) + 12)


    resultArray.length < 12 ?  $(".go-to-next-page").attr("disabled", "disabled") : $(".go-to-next-page").removeAttr("disabled")
    searchPageIndex < 1 ?  $(".go-to-prev-page").attr("disabled", "disabled") : $(".go-to-prev-page").removeAttr("disabled")

    addAndRemoveHideClass([''], [classReferences.prev_next_container])

    const html = formatSearchResultHtml(resultArray)
    const pageNum = searchPageIndex + 1;

    $('.results-container').html(html)
    $('.page').text(pageNum)

};

const sortResults = () => {
   const { sortNum, searchResults } = state

   if (sortNum === "a") {

        state.searchResults.sort((a, b) => {
            let itemA =  a.title.toUpperCase()
            let itemB = b.title.toUpperCase()

            if (itemA < itemB) {
                return -1
            }

            if (itemA > itemB) {
                return 1
            }

            return 0
        })

    }

    if (sortNum === "b") {
        searchResults.sort((a, b) => {
            let itemA =  a.author.toUpperCase()
            let itemB = b.author.toUpperCase()

            if (itemA < itemB) {
                return -1
            }

            if (itemA > itemB) {
                return 1
            }

            return 0
        })
    }

    if (sortNum === "c") {

        state.searchResults.sort((a, b) => {
            let itemA =  a.course.toUpperCase()
            let itemB = b.course.toUpperCase()

            if (itemA < itemB) {
                return -1
            }

            if (itemA > itemB) {
                return 1
            }

            return 0
        })
    }

    if (sortNum === "d") {
        state.searchResults.sort((a, b) => {
            let itemA =  a.typeOfResource.toUpperCase()
            let itemB = b.typeOfResource.toUpperCase()

            if (itemA < itemB) {
                return -1
            }

            if (itemA > itemB) {
                return 1
            }

            return 0
        })
    }

    if (sortNum === "f") {
       state.searchResults.reverse()
    }

     displaySearchResults()
}

const storeSearchResults = data => {
    if (data.length < 1) {

        return $('.results-container').text('Sorry, your search terms were too narrow and have not returned any results. Try refining your search terms!')
    }

    state.searchResults = data;
    sortResults()
};

const displayPriorPageOfSearchResults = () => {

    state.searchPageIndex--
    const { searchPageIndex, searchResults } = state

    searchPageIndex < 1 ?  $(".go-to-prev-page").attr("disabled", "disabled") : $(".go-to-prev-page").removeAttr("disabled")
    $(".go-to-next-page").removeAttr("disabled")

    const resultArray = searchResults.slice(searchPageIndex * 12, (searchPageIndex * 12) + 12)
    const html = formatSearchResultHtml(resultArray)
    const pageNum = searchPageIndex + 1;

    $('.results-container').html(html)
    $('.page').text(pageNum)

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
        state.sortNum = $('#sort-resources').val()

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
