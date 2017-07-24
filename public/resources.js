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
const makeRequestToAddNewResourceToUserDatabase = ({title, typeOfResource, course, content, resourceId, publishedOn, username}) => {
    const { username } = state
    const settings = {
        url: Urls.USER_RESOURCES_URL,
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
        success: updateForResourceAdd
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
const makeRequestToUpdateResourceDatabase = (resourceId, userame, content, title, typeOfResource, course, callback) => {

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
        success: callback
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
            myResources: { username,
                          content,
                          title,
                          typeOfResource,
                          course,
                          publishedOn,
                          resourceId
            }
        }),
        success: updateForResourceUpdate
    };

    $.ajax(settings)
}
