import {useUser} from "@clerk/clerk-react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

export default function SharedPagesTable({handleModal}) {

    const [sharedPages, setSharedPages] = useState([]);
    const userData = useUser();
    const navigate = useNavigate();
    const username = userData.user.username;
    const deletePage = async (pageID) => {
        // console.log('got this page id', pageID)
        // const response = await fetch(`http://localhost:3636/deletepage?pageId=${pageID}`)
        //
        // if (!response.ok) {
        //     return;
        // }
        //
        // const updatedUsers = userPages.filter((e) => e.pageID !== pageID)
        // console.log(updatedUsers, 'hi')
        // setUserPages(updatedUsers);
        console.log('delete page');
    }


    useEffect(() => {
        if (userData?.user) {
            async function fetchSharedPages() {
                const response = await fetch(`http://localhost:3636/getsharedpages?username=${username}`)
                const data = await response.json();

                console.log(data);
                setSharedPages(data)
            }
            fetchSharedPages();
        }
    }, [])

    return (

        <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">

                    <p className="mt-2 text-sm text-gray-700">

                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">

                </div>
            </div>
            <div className="mt-8 flow-root">
                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full  w-52 px-2 py-2 align-middle sm:px-6 lg:px-32">
                        <div className="overflow-hidden table-border  ring-1 ring-black ring-opacity-5">
                            <table className="min-w-full c divide-y  divide-gray-300">
                                <thead className="bg-gray-50 ">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                        Page
                                    </th>

                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                        OWNER
                                    </th>

                                    <th scope="col" className="w-1/5 px-3 py-3.5 text-left text-sm font-semibold text-gray-900">

                                    </th>

                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Edit</span>
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">

                                {sharedPages.map((userPages) => (
                                    <tr onClick={() => navigate(`/rooms/${userPages.page_id}`)} key={userPages.page_id}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                            {userPages.title}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{userPages.owner_username}</td>


                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">

                                            <div className="flex gap-10 justify-center flex-column">

                                                <button onClick={(event) => {
                                                    event.stopPropagation();
                                                    deletePage(userPages.page_id)

                                                }} className="bg-white text-black px-2 py-2 border-2 border-black rounded heavy-shadow w-10 h-10 flex items-center justify-center">
                                                    <img src="/icons8-trash-48.png" alt="" className="w-full h-full"/>
                                                </button>
                                            </div>
                                        </td>

                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <a href="#" className="text-indigo-600 hover:text-indigo-900">
                                                <span className="sr-only">, {userPages.title}</span>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
