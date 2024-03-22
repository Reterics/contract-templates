import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./store/AuthContext.tsx";
import SignInComponent from "./components/SignIn.tsx";
import Header from "./components/Header.tsx";
import PageLoading from "./components/PageLoading.tsx";
import {db, firebaseCollections, getCollection} from "./firebase/BaseConfig.ts";
import {Template} from "./interfaces/interfaces.ts";
import {BsFillTrashFill, BsPencilSquare} from "react-icons/bs";
import {doc, deleteDoc} from "firebase/firestore";
import TemplateModal from "./components/modals/TemplateModal.tsx";


function Templates() {
    const {user, loading} = useContext(AuthContext);
    const [templates, setTemplates] = useState([] as Template[]);
    const [showModal, setShowModal] = useState(false);

    if (!user) return <SignInComponent />;

    if (loading) return (<><Header /><PageLoading/></>);

    const deleteTemplate = async (id?: string) => {
        if (id && window.confirm('Are you sure you wish to delete this Invoice?')) {
            await deleteDoc(doc(db, firebaseCollections.templates, id));
        }
    };
    const refreshCollections = async () => {
        const templates = await getCollection(firebaseCollections.templates);
        setTemplates(templates as Template[]);
    };
    useEffect(() => {
        void refreshCollections();
    }, []);
    return (
        <>
            <Header />
            <div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg w-full m-auto mt-2">
                <div className="flex justify-between max-w-screen-xl m-2 p-2 w-full">
                    <div />
                    <button type="button"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none
                            focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2
                            dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            onClick={() => setShowModal(true)}
                    >
                        Create Template
                    </button>
                </div>
            </div>

            <div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg w-full m-auto mt-2">
                <table className="text-sm text-left text-gray-500 dark:text-gray-400 max-w-screen-xl w-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {templates.map((template) =>
                        <tr key={template.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">

                            <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {template.id}
                            </th>
                            <td className="px-6 py-4 flex flex-row text-lg">
                                <BsPencilSquare className="cursor-pointer ml-2" onClick={() => alert('To be implemented')}/>
                                <BsFillTrashFill className="cursor-pointer ml-2" onClick={() =>
                                    deleteTemplate(template.id)}/>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
            <TemplateModal visible={showModal} onClose={()=>setShowModal(false)}/>
        </>
    )
}

export default Templates
