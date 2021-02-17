import React, {useState, useEffect} from 'react';
import '../App.css'

const LoginComponent = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const login = async() => {
        //encoding in base64
        const base64Credentials =  btoa(email + ":" + password);
        const resp = await fetch('http://localhost:3030/', {
            headers: {
                Authorization: "Basic " + base64Credentials
            }
        })
        if(resp.ok){
            
        }
    }

    return(
        <div>
            <input type='text' placeholder='email' value={email} 
            onChange={event => setEmail(event.target.value)}/>

            <input type='password' placeholder='password' value={password} 
            onChange={event => setPassword(event.target.value)}/>
            
            <input type='button' onClick = {login} value='Login'/>
        </div>
    )
}

export default LoginComponent;