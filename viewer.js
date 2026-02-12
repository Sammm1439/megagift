// Firebase config — same keys
const firebaseConfig = {
  apiKey: "AIzaSyBVFBqpZLGOE5PN1hnRN4GNp3AHfjcHNxI",
  authDomain: "megagift03.firebaseapp.com",
  databaseURL: "https://megagift03-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "megagift03",
  storageBucket: "megagift03.firebasestorage.app",
  messagingSenderId: "220522611453",
  appId: "1:220522611453:web:95284da4a574518d26b494"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let pc = new RTCPeerConnection();
const remoteVideo = document.getElementById("remoteVideo");
let remoteStream = new MediaStream();
remoteVideo.srcObject = remoteStream;

// Add her camera + mic tracks
pc.ontrack = (event)=>{
  event.streams[0].getTracks().forEach(track => remoteStream.addTrack(track));
};

// Send viewer ICE candidates
pc.onicecandidate = (event)=>{
  if(event.candidate){
    db.ref("megagift-room/candidate-viewer").push(event.candidate.toJSON());
  }
};

// Get her offer
db.ref("megagift-room/sdp").once("value").then(async snapshot=>{
  const offer = snapshot.val();
  if(!offer) return;

  await pc.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);

  // Push answer to Firebase
  await db.ref("megagift-room/answer").set(answer.toJSON());
});

// Listen for her ICE candidates
db.ref("megagift-room/candidate").on("child_added", snapshot=>{
  const data = snapshot.val();
  if(data){
    pc.addIceCandidate(new RTCIceCandidate(data)).catch(console.error);
  }
});
