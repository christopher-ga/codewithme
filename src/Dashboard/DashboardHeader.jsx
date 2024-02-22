import Profile from "../EditorPage/Profile.jsx";

export default function DashboardHeader() {
    return (
        <>
            <div className="background-dashboard-nav">
                <div className='flex mx-5 py-3 items-center content-center justify-between bg-green'>
                    <div>
                        <a href="/">
                            <img className="w-20" src="/codewithmelogo.png" alt=""/>
                        </a>
                    </div>

                    <div className="content-center">
                        <ul className="flex gap-x-12">
                            <li>
                                Dashboard
                            </li>
                        </ul>
                    </div>

                    <div className="flex">
                        <div>
                            <Profile profile="/giraffe.jpg" isDashboard={true}></Profile>
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}