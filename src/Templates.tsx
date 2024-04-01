import {useContext, useEffect, useState} from "react";
import {AuthContext} from "./store/AuthContext.tsx";
import SignInComponent from "./components/SignIn.tsx";
import Header from "./components/Header.tsx";
import PageLoading from "./components/PageLoading.tsx";
import {db, firebaseCollections, getCollection} from "./firebase/BaseConfig.ts";
import {Template, TemplateRaw} from "./interfaces/interfaces.ts";
import {doc, deleteDoc, collection, setDoc } from "firebase/firestore";
import TemplateModal from "./components/modals/TemplateModal.tsx";
import {deleteFile, getFileFromStorage, uploadFile, uploadFileString} from "./firebase/storage.ts";
import {useNavigate} from "react-router-dom";
import TableViewComponent, {TableViewActions} from "./components/elements/TableViewComponent.tsx";
import {BsFillPlusCircleFill} from "react-icons/bs";


function Templates() {
    const {user, loading} = useContext(AuthContext);
    const [templates, setTemplates] = useState([] as Template[]);
    const [showModal, setShowModal] = useState(false);
    const [modalTemplate, setModalTemplate] = useState<Template|null>(null)
    const navigate = useNavigate();

    if (!user) return <SignInComponent />;

    if (loading) return (<><Header /><PageLoading/></>);


    const refreshCollections = async () => {
        const templates = await getCollection(firebaseCollections.templates);
        setTemplates(templates as Template[]);
    };
    useEffect(() => {
        void refreshCollections();
    }, []);

    const deleteTemplate = async (template: Template) => {
        if (template.id && window.confirm('Are you sure you wish to delete this Template?')) {
            await deleteDoc(doc(db, firebaseCollections.templates, template.id));
            if (template.path) {
                await deleteFile(template.path)
            }

            await refreshCollections();
        }
    };

    const closeTemplate = async (templateData?: TemplateRaw)=> {
        setShowModal(false);

        if (templateData && templateData.document.path && templateData.file) {
            await uploadFile(templateData.document.path, templateData.file);
        } else if (templateData && templateData.html) {
            if (!templateData.document.path) {
                templateData.document.path = "files/document_" + (new Date().getTime()) + ".html";
            }
            await uploadFileString(templateData.document.path, templateData.html);
        }

        if (templateData && templateData.document) {
            let modelRef;
            if (templateData.document.id) {
                modelRef = doc(db, firebaseCollections.templates, templateData.document.id);
            } else {
                modelRef = doc(collection(db, firebaseCollections.templates));
            }
            await setDoc(modelRef, templateData.document, { merge: true }).catch(e=>{
                console.error(e);
            });
            await refreshCollections();
        }
        setModalTemplate(null);
    }

    const openEditor = (template: Template) => {
        navigate("/editor?id=" + template.id);
    }

    const tableLines = templates.map(template=> {
        return [
            template.id,
            template.name || '',
            template.path ? template.path.replace('files/', '') : 'No file',
            TableViewActions({
                onPaste: () => openEditor(template),
                onEdit: async () => {
                    if (template && template.id) {
                        const tmp = await getFileFromStorage(template.id);
                        if (tmp && tmp.content) {
                            template.content = tmp.content;
                        }
                    }
                    setModalTemplate(template);
                    setShowModal(true)},
                onRemove: () => deleteTemplate(template)
            })
        ];
    });

    return (
        <>
            <Header />
            <div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg w-full m-auto mt-2">
                <div className="flex justify-between max-w-screen-xl m-2 p-2 w-full">
                    <h1 className="text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl dark:text-white">Templates</h1>
                    <button type="button"
                            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none
                            focus:ring-4 focus:ring-gray-300 font-medium rounded-lg px-5 py-2.5 mr-2
                            dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                            onClick={() => setShowModal(true)}
                    >
                        <BsFillPlusCircleFill />
                    </button>
                </div>
            </div>

            <div className="flex justify-center overflow-x-auto shadow-md sm:rounded-lg w-full m-auto mt-2">
                <TableViewComponent lines={tableLines} header={['ID', 'Name', 'Path', 'Action']}/>
            </div>
            <TemplateModal visible={showModal} onClose={(template: TemplateRaw)=>closeTemplate(template)} selected={modalTemplate}/>
        </>
    )
}

export default Templates;
