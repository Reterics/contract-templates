import {useContext, useState} from 'react'
import logo from '/logo.svg'
import './App.css'
import {AuthContext} from "./store/AuthContext.tsx";
import {SignUp} from "./firebase/services/AuthService.ts";
import {UserFormValues} from "./interfaces/interfaces.ts";
import PageLoading from "./components/PageLoading.tsx";

function App() {
    const {SignIn, SignOut, user, loading} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <div>
                <a href="https://reterics.com" target="_blank">
                    <img src={logo} className="logo react reterics" alt="Reterics logo"/>
                </a>
            </div>
            <h1>Vite + React + Firebase Auth</h1>
            {!loading && !user &&
                <div className="card">
                    <input name="email" value={email}
                           onChange={(e) => setEmail(e.target.value)}/>
                    <br/>
                    <input name="password" type="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                    <br/>
                    <button onClick={() => SignIn({email: email, password: password})}>SignIn</button>
                    <button onClick={() => SignUp({email, password} as UserFormValues)}>SignUp</button>
                </div>
            }

            {!loading && user &&
                <div className="card">
                    <button onClick={() => SignOut()}>Sign Out</button>
                </div>
            }

            {loading && <PageLoading/>}

        </>
    )
}

export default App
