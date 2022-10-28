// import { useEffect, useState } from "react";
import axios from 'axios';
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from '../../context/Context';
import "./index.css"


let Signup = () => {

    let { state, dispatch } = useContext(GlobalContext);
    const [Name, setName] = useState("")
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const [users, setUsers] = useState([])
    const [toggleRefresh, setToggleRefresh] = useState(true)

    useEffect(() => {

        let getAllUsers = async () => {
            let response = await axios.get(`${state.baseUrl}/users`);
            setUsers(response.data.data)
        }
        getAllUsers();

    }, [toggleRefresh])



    const doSignup = async (e) => {
        e.preventDefault();

        var profilePictureInput = document.getElementById("profilePictureInput");
        console.log("fileInput: ", profilePictureInput.files); // local url

        let formData = new FormData();
        // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append#syntax


        formData.append("name", Name); // this is how you add some text data along with file
        formData.append("email", Email); // this is how you add some text data along with file
        formData.append("password", Password); // this is how you add some text data along with file
        formData.append("profilePicture", profilePictureInput.files[0]); // file input is for browser only, use fs to read file in nodejs client


        await axios({
            method: 'post',
            url: `${state.baseUrl}/signup`,
            // url: "http://localhost:5001/signup",
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            // withCredentials: true
        })
            .then(res => {
                console.log(`upload Success` + res.data);
                setToggleRefresh(!toggleRefresh)
            })
            .catch(err => {
                console.log(err);
            })
    }
    return (
        <div>
            <h1 className='signup'>Sign up</h1>
            <div className='container'>
                <form className='form' onSubmit={doSignup}>

                    Name: <input name="name" type="text" placeholder="Name" id='name' onChange={(e) => { setName(e.target.value) }} />
                    <br />
                    Email: <input name="email" type="email" placeholder="Email" id='email' onChange={(e) => { setEmail(e.target.value) }} />
                    <br />
                    Password: <input name="password" type="password" placeholder="Password" id='password' onChange={(e) => { setPassword(e.target.value) }} />
                    <br />

                    Profile Picture: <input type="file" id="profilePictureInput" accept='image/*'
                        onChange={() => {
                            ////// to display images instantly on screen
                            var profilePictureInput = document.getElementById("profilePictureInput");
                            var url = URL.createObjectURL(profilePictureInput.files[0])
                            console.log("url: ", url);
                            document.getElementById("img").innerHTML = `<img width="200px" src="${url}" alt="" id="img"> `
                        }} />

                    <div id="img"></div>

                    <br />
                    <button type='submit'>Signup</button>

                </form>
            </div>

            <h1 className='header'>Users List: </h1>

            <div>
                {users.map(eachUser => (
                    <div className='container'>
                        <div className='users'>
                            <div key={eachUser.id}>
                                <div className='profile'>
                                <img className='img' src={eachUser.profilePicture} alt="" />
                                <span><b>{eachUser.name}</b></span>
                                </div>
                                <h6>Email: {eachUser.email}</h6>
                                
                                <br />
                            </div>
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}

export default Signup;