
import MyPagesTable from "./MyPagesTable.jsx";
import SharedPagesTable from "./SharedPagesTable.jsx";
import DashboardHeader from "./DashboardHeader.jsx";
import DashboardOptions from "./DashboardOptions.jsx";
import ShareModal from "./ShareModal.jsx";
import {useState} from "react";
export default function Dashboard() {
    const [isModalOpen, setModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({});
    const [showSharedTable, setSharedTable] = useState(false);
    const handleModal = (newContent) => {
        setModalContent(newContent);
        setModalOpen(currentModal => !currentModal);
    }

    const handleSharedPages = () => {
        setSharedTable(true)
    }

    const handleMyPages = () => {
        setSharedTable(false)
    }

    const showMypages = () => {

    }
    return (
        <>
            <div className="background-dashboard h-screen">
                <DashboardHeader/>
                <DashboardOptions showSharedTable={showSharedTable} handleSharedPages={handleSharedPages} handleMyPages={handleMyPages}/>
                {!showSharedTable && <MyPagesTable  handleModal={handleModal} /> }
                {showSharedTable && <SharedPagesTable ></SharedPagesTable>}
                <ShareModal handleModal={handleModal} modalContent={modalContent} isOpen={isModalOpen} ></ShareModal>
            </div>
        </>
    )
}

