export default function SaveButton({editorRef, pageId, pageTitle}) {

    console.log(pageTitle, pageId)
    const handleSaveClick = async (e) => {
        e.preventDefault();
        const currentEditorContent = editorRef.current.getValue();

        const response = await fetch('http://localhost:3636/savepagecontent', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currentEditorContent,
                pageId,
                pageTitle
            }),
        })

        const data = await response.json();
        console.log(data);



    }
    return (
        <>
            <button onClick={handleSaveClick}>save</button>
        </>
    )
}