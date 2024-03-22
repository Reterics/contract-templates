import { User } from 'firebase/auth';
import {ChangeEventHandler, ReactEventHandler} from "react";


export interface LoginFormValues {
    email: string;
    password: string;
}

export interface UserFormValues {
    email: string;
    password: string;
    displayName: string;
}

//IAuth context
export  interface  IAuth {
    user:  User  |  null;  //type User comes from firebase
    loading:  boolean;
    SignIn: (credentials:  LoginFormValues) =>  void;
    SignUp: (credentials:  UserFormValues) =>  void;
    SignOut: () =>  void;
    error: string | null
}

export interface Template {
    id: string
    name?: string
}

export interface GeneralModalArguments {
    visible?:boolean
    onClose?: Function
    title?: string
    onSave?: Function
    buttons?: GeneralModalButtons[]
    children: React.ReactNode
}

export interface ModalArguments {
    visible?:boolean
    title?: string
    onClose?: Function
}
export interface GeneralModalButtons {
    value: string
    onClick: Function
    primary: boolean
}


export interface CTInputArgs {
    value?: string | number | readonly string[]
    onChange?: ChangeEventHandler<HTMLInputElement> | undefined,
    type?: string,
    name?: string,
    label?: string|number,
    placeholder?: string,
    pattern?: string,
    maxLength?: number,
    min?: string,
    max?: string,
    step?: string,
}
export interface CTSelectOption {
    name: string,
    value: string
}
export interface CTSelectArgs {
    value?: string | number | readonly string[]
    onSelect?: ReactEventHandler<HTMLSelectElement> | undefined,
    type?: string,
    name?: string,
    label?: string|number,
    options: CTSelectOption[]
}
