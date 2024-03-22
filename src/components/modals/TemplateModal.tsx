import {ModalArguments, Template} from "../../interfaces/interfaces.ts";
import GeneralModal from "./GeneralModal.tsx";
import CTInput from "../elements/CTInput.tsx";
import {useState} from "react";


export default function TemplateModal({
    visible,
    onClose,
    title

} :ModalArguments) {

    if (visible === false) return null;

    const [template, setTemplate] = useState<Template>({id: ""});

    const changeType = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        const value = e.target.value;
        setTemplate((currentTemplate: any) => {
            const obj = {...currentTemplate};
            obj[key] = value;
            return obj;
        });
    };
    return (
        <GeneralModal title={title || "Template Modal"} buttons={[{
            value: 'Close',
            onClick: ()=> { if (typeof onClose === "function"){onClose()}},
            primary: false
        }]}>

            <div className="w-full max-w-screen-lg p-6 bg-white border border-gray-200 rounded-lg shadow
                        dark:bg-gray-800 dark:border-gray-700 mr-1 pt-9">

                <CTInput
                    type="text" name="name"
                    value={template.name}
                    onChange={(e) => changeType(e, 'name')}
                    label="Template name"
                />

            </div>
        </GeneralModal>
    )
}