let messagesArray = [], destroyer, bun;

window.onload = () => {
	destroyer = setInterval(() => destroyMessages(), 100)
}

bun = new Bun({
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

bun.on('peer-data-recieved', (data) => {
	const hTag = document.createElement("h1");
	hTag.id = `m-${~~(Math.random() * 1000)}`
	hTag.setAttribute(
		"class",
		"w-fit px-3 py-1 mx-4 bg-green-200 rounded-lg shadow self-start"
	);
	hTag.innerText = data;
	hTag.style.opacity = 1;
	document.querySelector("#messages").append(hTag);
	messagesArray.push(hTag.id)
})

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

const handleInput = (e) => {
	let data = document.querySelector('#chat').value;
	data = data.trim();
	if (data === "" || !data) return;
	bun.sendData(data);
	const hTag = document.createElement("h1");
	hTag.id = `m-${~~(Math.random() * 1000)}`
	hTag.setAttribute(
		"class",
		"w-fit px-3 py-1 mx-4 bg-white rounded-lg shadow self-end"
	);
	hTag.innerText = data;
	hTag.style.opacity = 1;
	document.querySelector("#messages").append(hTag);
	messagesArray.push(hTag.id)
	document.querySelector("#chat").value = "";
}

const destroyMessages = () => {
	if (messagesArray.length > 0) {
		let toRemove = [], n
		messagesArray.forEach(id => {
			const el = document.querySelector(`#${id}`);
			if (el.innerHTML.length > 100) {
				n = parseFloat((1 / parseInt(el.innerHTML.length)).toFixed(3));
			} else n = 0.01
			if (el.style.opacity > 0) {
				el.style.opacity = el.style.opacity - n
			} else {
				toRemove.push(id)
				el.remove()
			}
		})
		toRemove.forEach(id => messagesArray = messagesArray.filter(x => x != id))
	} else return;
}
