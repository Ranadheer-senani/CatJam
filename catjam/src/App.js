import React,{useRef,useState} from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/analytics';

import{ useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyA_HrFoCpFbNbpM64gWbiFwcpmFiyy35VQ",
  authDomain: "catjam-007.firebaseapp.com",
  projectId: "catjam-007",
  storageBucket: "catjam-007.appspot.com",
  messagingSenderId: "825747568117",
  appId: "1:825747568117:web:5626015618257663ad1cbc",
  measurementId: "G-K2EZJNJ82S"
})

const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header">
        <h1>CatJam 😺📻</h1>
        <SignOut />
      </header>
      <section>
        {user ? <Queue />:<SignIn />}
      </section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    <button className='sign-in' onClick={signInWithGoogle}>Sign in with Google!</button>
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button className='sign-out' onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Queue(){
  const dummy = useRef();
  const playlistRef = firestore.collection('playlist');
  const query = playlistRef.orderBy('createdAt').limit(25);

  const[playlist] = useCollectionData(query,{idField: 'id'});

  const [formValue,setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, displayName } = auth.currentUser;

    await playlistRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behaviour: 'smooth'});
  }
  var videoId = 'B-pNp0LUV2Y';

  return (<>
  <main>
    {playlist && playlist.map(msg => <QueueSong key={msg.id} message = {msg}/>)}

    <span ref = {dummy}></span>
    <bod>
    <iframe id="player"
      type="text/html"
      width="60"
      height="30" 
      src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com`} 
      frameborder="0">
     </iframe>
    </bod>
  </main>

  <form onSubmit={sendMessage}>
    <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Add a Song"/>
    <button type = "submit" disabled = {!formValue}>🎷</button>
  </form>
  </>
  )
function QueueSong(props){
  const { text, uid, displayName} = props.message;
  
  const songClass = uid === auth.currentUser.uid ? "sent" : "received";
  videoId = text;
  console.log(videoId);
  return (<>
  <div className={`message ${songClass}`}>
    <p>{displayName}</p>
    <p>{text}</p>
  </div>
  </>

  )
}
}

export default App;
