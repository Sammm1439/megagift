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

const remoteVideo = document.getElementById("remoteVideo");
let peerConnection;
const config = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

// Initialize PeerConnection
peerConnection = new RTCPeerConnection(config);

// Add remote stream to video element
peerConnection.ontrack = event => {
  remoteVideo.srcObject = event.streams[0];
};

// Listen for ICE candidates from host
streamsCollection.doc("offer").collection("candidates").onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === "added") {
      const candidate = new RTCIceCandidate(change.doc.data());
      peerConnection.addIceCandidate(candidate);
    }
  });
});

// Fetch offer from Firebase and create answer
(async () => {
  const offerDoc = await streamsCollection.doc("offer").get();
  if (!offerDoc.exists) return alert("Stream not started yet.");

  const offer = offerDoc.data();
  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);

  // Save answer to Firebase
  await streamsCollection.doc("answer").set({ sdp: answer.sdp, type: answer.type });
})();
