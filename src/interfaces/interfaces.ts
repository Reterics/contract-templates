import { User } from 'firebase/auth'; //type User import


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
