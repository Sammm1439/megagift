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
const db = firebase.firestore();
const streamsCollection = db.collection("streams");

let localStream;
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

startBtn.addEventListener('click', async () => {
  try {
    // Get camera + mic
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

    // Create WebRTC Peer Connection
    peerConnection = new RTCPeerConnection(config);

    // Add local tracks
    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    // ICE candidates
    peerConnection.onicecandidate = event => {
      if (event.candidate) {
        streamsCollection.doc("offer").collection("candidates").add(event.candidate.toJSON());
      }
    };

    // Create Offer
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    // Save offer to Firebase
    await streamsCollection.doc("offer").set({ sdp: offer.sdp, type: offer.type });

    alert("Stream started! Viewers can now see it.");

  } catch (err) {
    console.error(err);
    alert("Error accessing camera/mic. Make sure permissions are allowed.");
  }
});

stopBtn.addEventListener('click', () => {
  if (localStream) {
    localStream.getTracks().forEach(track => track.stop());
    localStream = null;
  }
  if (peerConnection) {
    peerConnection.close();
    peerConnection = null;
  }
  alert("Stream stopped.");
});


