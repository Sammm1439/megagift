// ===== FIREBASE CONFIG =====
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

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Start Stream
startBtn.addEventListener('click', async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    peerConnection = new RTCPeerConnection(config);

    // Add tracks
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // ICE candidates
    peerConnection.onicecandidate = event => {
      if(event.candidate){
        db.ref('candidates').push(event.candidate.toJSON());
      }
    };

    // Create offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Save offer manually (type + sdp)
    const offerData = {
      type: offer.type,
      sdp: offer.sdp
    };
    await db.ref('offer').set(offerData);

    alert("Stream started! Viewers can now see it.");

  } catch(err) {
    console.error(err);
    alert("Error accessing camera/mic! Make sure you are on HTTPS or localhost and allowed camera/mic permissions.");
  }
});

// Stop Stream
stopBtn.addEventListener('click', () => {
  if(localStream){
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  if(peerConnection){
    peerConnection.close();
    peerConnection = null;
  }
  db.ref('offer').remove();
  db.ref('answer').remove();
  db.ref('candidates').remove();
  alert("Stream stopped.");
});
