// ===== FIREBASE CONFIG =====
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
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

