const hostUrl = import.meta.env.VITE_REACT_APP_HOST_URL;

const deletePageRequest = async (pageID, userPages, setUserPages) => {
    const response = await fetch(`${hostUrl}/deletepage?pageId=${pageID}`)

    if (!response.ok) {
        return
    }

    return 'deleted page'
}

export {deletePageRequest}