import React,{useRef,useState} from 'react';
import { getAnalytics, logEvent } from "firebase/analytics";
import './App.css';
import { Box, Flex, Input, IconButton, Button, Center, Spacer, CircularProgress, CircularProgressLabel, Avatar, Text, Badge } from '@chakra-ui/react';
import {SearchIcon} from "@chakra-ui/icons"

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

  var videoId = 'B-pNp0LUV2Y';


function App() {

  const [user] = useAuthState(auth);

  return (
    <Box className="App" bg='#282c34' color='white'>
      <header className="App-header">
        <h1>CatJam 😺📻</h1>
        <br></br>
        <Flex align = 'center' justify={'center'}>
          {/* <CircularProgress value={40} >
            <CircularProgressLabel>`${videoId}`</CircularProgressLabel>
          </CircularProgress> */}
          playing: {videoId}
        </Flex>
        <br></br>
        <SignOut />
      </header>
      <section>
        {user ? <Queue />:<SignIn />}
      </section>
    </Box>
  );
}

function SignIn() {

  const signInWithGoogle = () =>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <>
    <Button colorScheme={'cyan'} className='sign-in' onClick={signInWithGoogle}>Sign in with Google!</Button>
    </>
  )
}

function SignOut(){
  return auth.currentUser && (
    <Button colorScheme={'cyan'} className='sign-out' onClick={() => auth.signOut()}>Sign Out</Button>
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

    const { uid, displayName, photoURL } = auth.currentUser;

    await playlistRef.add({
      text:formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      displayName,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behaviour: 'smooth'});
  }

  return (<>
  <main>
    {playlist && playlist.map(msg => <QueueSong key={msg.id} message = {msg}/>)}

    <span ref = {dummy}></span>
      <Center>
        <iframe id="player"
          type="text/html"
          width="60px"
          height="30px" 
          src={`http://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=http://example.com`} 
          frameborder="0">
        </iframe>
        </ Center>
  </main>

  <form onSubmit={sendMessage}>
    <Input value={formValue} width='auto' onChange={(e) => setFormValue(e.target.value)} placeholder="Add a Song"/>
    <IconButton colorScheme="cyan" aria-label = "submit" icon={<SearchIcon className="SearchIcon"/>} disabled = {!formValue}/>
  </form>
  </>
  )
function QueueSong(props){
  const { text, uid, displayName, photoURL} = props.message;
  
  const songClass = uid === auth.currentUser.uid ? "sent" : "received";
  videoId = text;
  console.log(videoId);
  return (<>
  {/* <div className={`message ${songClass}`} >
    <p>{displayName}</p>
    <p>{text}</p>
  </div>
  </> */}
  <Spacer/>
  <Flex> {/* align="center" justify="center"*/}
  <Center mr='30%'>
   
    <Avatar src={photoURL} />
    <Box ml='3' mb='4'>
      <Text fontWeight='bold'>
        {displayName}
        <Badge ml='1' colorScheme='pink'>
          New
        </Badge>
      </Text>
      <Text fontSize='sm'>{videoId}</Text>
    </Box>
    </Center>
  </Flex>
</>
  )
}
}

logEvent(analytics, 'notification_received');

export default App;