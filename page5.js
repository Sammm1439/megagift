const localVideo = document.getElementById("localVideo");
const startBtn = document.getElementById("startStream");

let localStream;

// 1️⃣ Create PeerJS with a fixed ID and server
const peer = new Peer("host123", {
  host: 'megagift-peerjs.onrender.com', // replace with your PeerJS server URL
  port: 443,
  path: '/'
});

peer.on('open', id => {
  console.log("Host Peer ID:", id);
});

startBtn.addEventListener('click', async () => {
  try {
    // 2️⃣ Get camera + mic
    localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    localVideo.srcObject = localStream;

    // 3️⃣ Answer incoming calls from viewer
    peer.on('call', call => {
      call.answer(localStream);
    });

    alert("Streaming started! Go to Page 6 to play the game.");

  } catch(err) {
    console.error("Error accessing camera/mic:", err);
    alert("Cannot access camera/mic. Please allow permissions and refresh.");
  }
});
