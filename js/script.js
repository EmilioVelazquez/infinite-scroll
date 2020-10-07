// HTML document
const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArray = [];
// Error counter
var failedAttemps = 0;

// Unsplash PI
const apiProxy = "https://afternoon-ocean-69095.herokuapp.com/unsplash";
let count = 5;

// Checks if all images were loaded
function imageLoaded() {
	imagesLoaded++;
	if (imagesLoaded === totalImages) {
		ready = true;
		loader.hidden = true;
		count = 20;
	}
}

// Setter function for DOM elements
function setAttributes(element, attributes) {
	for (const key in attributes) {
		element.setAttribute(key, attributes[key]);
	}
}

// Create elements for links and photos, add to DOM
function displayPhotos() {
	imagesLoaded = 0;
	totalImages = photosArray.length;
	photosArray.forEach((photo) => {
		// Create <a> to link Unsplahs
		const item = document.createElement("a");
		setAttributes(item, {
			href: photo.links.html,
			target: "_blank",
		});
		// Create <img> for photo
		const img = document.createElement("img");
		setAttributes(img, {
			src: photo.urls.regular,
			alt: photo.alt_description,
			title: photo.alt_description,
		});
		// Checks when each img is loaded
		img.addEventListener("load", imageLoaded);
		// Puts image inside <a>, then puts both inside imageContainer element
		item.appendChild(img);
		imageContainer.appendChild(item);
	});
}

// Get photos using Unsplash API
async function getPhotos() {
	try {
		const reponse = await fetch(`${apiProxy}&count= ${count}`);
		photosArray = await reponse.json();
		displayPhotos();
	} catch (error) {
		// Catch error here
		if (failedAttemps < 10) {
			getPhotos();
			failedAttemps++;
		} else {
			console.error("Failed to get more photos", error);
		}
	}
}

// Check if scrolling near bottom
window.addEventListener("scroll", () => {
	if (
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
		ready
	) {
		ready = false;
		getPhotos();
	}
});

window.onload = getPhotos;
