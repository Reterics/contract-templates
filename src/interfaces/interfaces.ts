import { User } from 'firebase/auth';


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
}

export interface GeneralModalArguments {
    visible:boolean
    onClose: Function
    title: string
    onSave: Function
    buttons?: GeneralModalButtons[]
    children: React.ReactNode
}
export interface GeneralModalButtons {
    value: string
    onClick: Function
    primary: boolean
}