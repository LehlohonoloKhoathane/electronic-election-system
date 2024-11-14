import './profile.css'
import React ,{ useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc } from 'firebase/firestore';
// import { toast } from "react-toastify";

function Profile () {
    const [userDetails, setUserDetails] = useState("");
    const fetchUserData = async () => {
        auth.onAuthStateChanged(async (user) => {
            console.log(user);
            const docRef = doc(db, "Users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()){
                setUserDetails(docSnap.data());
                console.log(docSnap.data());
            }else{
                console.log("User is not logged in");
            }
        });
    };
    useEffect(() => {
        fetchUserData();
    }, []);
    return(
        <div className='myProfile'>
            {userDetails ? (
                <>
                    <h3>Welcome {userDetails.firstName} </h3>
                    <div>
                        <p>Email: {userDetails.email}</p>
                        <p>Full Name: {userDetails.firstName}</p>
                        <p></p>
                    </div>
                    <button className="btn btn-primary">
                        Logout
                    </button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div> 
    );
}

export default Profile;