const remoteVideo = document.getElementById('remoteVideo');

// 1️⃣ Create Peer object
const peer = new Peer({
  host: 'megagift-peerjs.onrender.com', // same server
  port: 443,
  path: '/'
});

// 2️⃣ Automatically call host
peer.on('open', id => {
  console.log("Viewer Peer ID:", id);

  const call = peer.call("host123", null); // connect to host
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream; // show her live video
  });
});
