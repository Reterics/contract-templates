import {firebaseAuth} from '../firebase/BaseConfig';
import React, {createContext, useEffect, useState} from 'react';
import {IAuth, LoginFormValues, UserFormValues} from "../interfaces/interfaces.ts";
import {useNavigate} from 'react-router-dom';
import {SignIn, SignOut, SignUp} from "../firebase/services/AuthService.ts";
import {onAuthStateChanged, User} from 'firebase/auth';
import PageLoading from "../components/PageLoading.tsx";

export const AuthContext = createContext<IAuth>({
    user: firebaseAuth.currentUser,
    loading: false,
    SignIn: () => {},
    SignUp: () => {},
    SignOut: () => {},
});


const AuthProvider = ({children}: { children: React.ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
    const navigate = useNavigate();


    const SignUpMethod = (credentials: UserFormValues) => {
        setIsLoading(true);
        SignUp(credentials)
            .then(async userCredential => {
                const {user} = userCredential; //object destructuring
                if (user) {
                    setCurrentUser(user);
                    //redirect the user on the targeted route
                    navigate('/', {replace: true});
                } else {
                    //TODO: Handle if user is empty
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                //check for error
                if (error.code === 'auth/email-already-in-use') {
                    //show an alert or console
                } else if (error.code === 'auth/too-many-requests') {
                    //do something like an alert
                }
                // you can check for more error like email not valid or something
                setIsLoading(false);
            });
    }

    const SignInMethod = async (creds: LoginFormValues) => {
        console.log('Sign via', creds)
        setIsLoading(true);
        SignIn(creds)
            .then(userCredential => {
                const {user} = userCredential;
                if (user) {
                    setCurrentUser(user);
                    //redirect user to targeted route
                    navigate('/', {replace: true});
                } else {
                    // TODO: Handle if user is empty
                }
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
                //TODO: show error

                if (error.code === 'auth/wrong-password') {}
                else if (error.code === 'auth/too-many-requests') {}
                setIsLoading(false);
            });
    }

    const SignOutMethod = async () => {
        setIsLoading(true);
        try {
            await SignOut();
            setCurrentUser(null);
            setIsLoading(false);
            navigate('/signin', {replace: true});
        } catch (error) {
            setIsLoading(false);
            //show error alert
        }
    }
    //create Auth Values
    const authValues: IAuth = {
        user: currentUser,
        loading: isLoading,
        SignIn: SignInMethod,
        SignUp: SignUpMethod,
        SignOut: SignOutMethod,
    }

    useEffect(() => {
        //onAuthStateChanged check if the user is still logged in or not
        return onAuthStateChanged(firebaseAuth, user => {
            setCurrentUser(user);
            setIsAuthLoading(false);
        });
    }, []);

    //If loading for the first time when visiting the page
    if (isAuthLoading) return <PageLoading/>;

    return (
        <AuthContext.Provider value={authValues}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;