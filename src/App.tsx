import {useContext, useEffect, useState} from 'react'
import './App.css'
import {AuthContext} from "./store/AuthContext.tsx";
import PageLoading from "./components/PageLoading.tsx";
import Header from "./components/Header.tsx";
import SignInComponent from "./components/SignIn.tsx";
import {ContractDocument} from "./interfaces/interfaces.ts";
import {db, firebaseCollections, getCollection} from "./firebase/BaseConfig.ts";
import {useNavigate} from "react-router-dom";
import {deleteDoc, doc} from "firebase/firestore";
import TableViewComponent, {TableViewActions} from "./components/elements/TableViewComponent.tsx";

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

    const tableLines = documents.map(document => {
        return [
            document.id,
            document.name || '',
            TableViewActions({
                onPaste: () => openEditor(document),
                onRemove: () => deleteDocument(document)
            })
        ];
    });

    return (
        <>
            <Header />
            {loading && <PageLoading/>}

            <div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg w-full m-auto mt-2">
                <TableViewComponent lines={tableLines} header={['ID', 'Name', 'Action']}/>
            </div>
        </>
    )
}

export default App;
