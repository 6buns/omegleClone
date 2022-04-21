const bun = new Bun({
	secret: "f384d6193",
	room: "abcdef",
});

bun.on("new-peer", (event) => {
	// Create a video element for this peer, and add to page.
	let vid = document.createElement("video");
	vid.setAttribute(
		"class",
		"remote w-80 h-48 bg-white rounded-2xl shadow-lg m-4"
	);
	vid.setAttribute("id", `remote-video-${event.target.to.name}`);
	vid.controls = true;
	vid.autoplay = true;
	vid.muted = true;
	vid.poster = event.target.poster;
	document.querySelector("main").append(vid);
});

bun.on("new-remote-track", (event) => {
	// Find the video element for this peer.
	let vid = document.querySelector(`#remote-video-${event.target.to.name}`);

	// Add track src to video
	try {
		vid.srcObject = event.streams[0];
	} catch (error) {
		vid.src = URL.createObjectURL(event.streams[0]);
	}
});

bun.on("peer-left", (peer_id) => document.querySelector(`#remote-video-${peer_id}`).remove());

bun.on('error', (e) => console.error(e))

bun.on("screen-share-ended", (e) => document.getElementById("screen").disabled = false);

const handleClick = (e) => {
	switch (e.id) {
		case "screen":
			console.log("switching to screen");
			bun.screenShare();
			document.getElementById("screen").disabled = true;
			break;
		case "video": {
			const state =
				document.getElementById("video").getAttribute("aria-state") ===
					"1"
					? true
					: false;
			if (state) {
				console.log("stop video");
				bun.toggleMedia("video");
				document.getElementById("video").innerHTML = "Start Video";
				document.getElementById("video").setAttribute("aria-state", "0");
				break;
			} else {
				console.log("start video");
				bun.toggleMedia("video");
				document.getElementById("video").innerHTML = "Stop Video";
				document.getElementById("video").setAttribute("aria-state", "1");
				break;
			}
		}
		case "audio": {
			const state =
				document.getElementById("audio").getAttribute("aria-state") ===
					"1"
					? true
					: false;
			if (state) {
				console.log("stop Audio");
				bun.toggleMedia("audio");
				document.getElementById("audio").innerHTML = "Start Audio";
				document.getElementById("audio").setAttribute("aria-state", "0");
				break;
			} else {
				console.log("start Audio");
				bun.toggleMedia("audio");
				document.getElementById("audio").innerHTML = "Stop Audio";
				document.getElementById("audio").setAttribute("aria-state", "1");
				break;
			}
		}
	}
};
