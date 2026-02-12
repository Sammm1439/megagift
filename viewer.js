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

const remoteVideo = document.getElementById("remoteVideo");
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Initialize PeerConnection
peerConnection = new RTCPeerConnection(config);

// Display remote stream
peerConnection.ontrack = event => {
  remoteVideo.srcObject = event.streams[0];
};

// Listen for ICE candidates from host
db.ref('candidates').on('child_added', snapshot => {
  const candidate = new RTCIceCandidate(snapshot.val());
  peerConnection.addIceCandidate(candidate);
});

// Get host offer and create answer
(async () => {
  const offerSnap = await db.ref('offer').get();
  if(!offerSnap.exists()) return alert("Stream not started yet.");

  const offer = offerSnap.val();
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  // Send answer to database
  db.ref('answer').set(answer.toJSON());
})();
