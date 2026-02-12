const remoteVideo = document.getElementById("remoteVideo");
const peerIdInput = document.getElementById("peerIdInput");
const connectBtn = document.getElementById("connectBtn");

const peer = new Peer(); // your Peer object

connectBtn.addEventListener('click', () => {
  const hostId = peerIdInput.value.trim();
  if(!hostId) return alert("Enter the host Peer ID!");

  // 1️⃣ Call host
  const call = peer.call(hostId, null); // no stream needed, only receiving
  call.on('stream', remoteStream => {
    remoteVideo.srcObject = remoteStream; // show her live video/audio
  });
});

peer.on('open', id => {
  console.log("Viewer Peer ID:", id);
});
