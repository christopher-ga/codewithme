import NewPageButton from "./NewPageButton.jsx";

export default function DashboardOptions({handleMyPages, handleSharedPages, showSharedTable}) {


    return (
        <>
            <div
                className="inline-block min-w-full flex justify-between flex-column w-52 px-2 align-middle sm:px-6 lg:px-32">
                <div className="content-center">
                    <ul className="flex gap-x-12">
                        <button onClick={handleMyPages}
                                className={`mt-10 bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow ${showSharedTable ? 'bg-white-600' : 'bg-green-300'}`}>
                            My Pages
                        </button>
                        <button onClick={handleSharedPages}
                                className={`mt-10 bg-white text-black px-4 py-2  border-2 border-black rounded heavy-shadow ${showSharedTable ? 'bg-green-300' : 'bg-white-400'}`}>
                            Shared With Me
                        </button>
                    </ul>
                </div>

                <div>
                    <NewPageButton></NewPageButton>
                </div>
            </div>
        </>
    )
}