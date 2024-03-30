import {useContext, useEffect, useState} from 'react'
import './App.css'
import {AuthContext} from "./store/AuthContext.tsx";
import PageLoading from "./components/PageLoading.tsx";
import Header from "./components/Header.tsx";
import SignInComponent from "./components/SignIn.tsx";
import {BsFileText, BsFillTrashFill} from "react-icons/bs";
import {ContractDocument} from "./interfaces/interfaces.ts";
import {db, firebaseCollections, getCollection} from "./firebase/BaseConfig.ts";
import {useNavigate} from "react-router-dom";
import {deleteDoc, doc} from "firebase/firestore";

function App() {
    const {user, loading} = useContext(AuthContext);

    if (!user) return <SignInComponent />;

    const [documents, setDocuments] = useState<ContractDocument[]>([])
    const navigate = useNavigate();

    const refreshCollections = async () => {
        const documents = await getCollection(firebaseCollections.documents);
        setDocuments(documents as ContractDocument[]);
    };
    useEffect(() => {
        void refreshCollections();
    }, []);

    const openEditor = (document: ContractDocument) => {
        if (document.template && document.id) {
            navigate("/editor?id=" + document.template + "&document="+document.id);
        } else {
            alert('Invalid document data');
            console.error(document);
        }
    }

    const deleteDocument = async (document: ContractDocument) => {
        if (document.id && window.confirm('Are you sure you wish to delete this Document?')) {
            await deleteDoc(doc(db, firebaseCollections.documents, document.id));
            await refreshCollections();
        }
    }
    return (
        <>
            <Header />
            {loading && <PageLoading/>}

            <div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg w-full m-auto mt-2">
                <table className="text-sm text-left text-gray-500 dark:text-gray-400 max-w-screen-xl w-full">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            ID
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Action
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {documents.map((document) =>
                        <tr key={document.id} className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">

                            <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white p-2">
                                {document.id}
                            </th>
                            <th scope="row"
                                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {document.name || ''}
                            </th>
                            <td className="px-6 py-4 flex flex-row text-lg p-2">
                                <BsFileText className="cursor-pointer ml-2 mr-1" onClick={() => openEditor(document)}/>
                                <BsFillTrashFill className="cursor-pointer ml-2" onClick={() =>
                                    deleteDocument(document)}/>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default App
