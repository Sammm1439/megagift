const localVideo = document.getElementById("localVideo");
const startBtn = document.getElementById("startStream");
const peerIdDisplay = document.getElementById("peerIdDisplay");

let localStream;
let peer;

// 1️⃣ Create PeerJS object (host)
peer = new Peer(undefined, { host:'0.peerjs.com', port:443, secure:true });

peer.on('open', id => {
  console.log("Peer ID:", id);
  peerIdDisplay.innerText = id; // show ID on page
});

// 2️⃣ Start stream on button click
startBtn.addEventListener('click', async () => {
  try {
    localStream = await navigator.mediaDevices.getUserMedia({ video:true, audio:true });
    localVideo.srcObject = localStream;

    // 3️⃣ Answer incoming calls (send her stream)
    peer.on('call', call => {
      call.answer(localStream);
    });

    alert("Streaming ready! Share your Peer ID with the viewer.");

  } catch(err) {
    console.error("Error accessing camera/mic:", err);
    alert("Cannot access camera/mic. Please allow permissions and refresh the page.");
  }
});
