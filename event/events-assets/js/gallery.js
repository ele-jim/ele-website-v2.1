let currentIndex = 0;
let galleryItems = [];

// Load media
async function loadMedia() {
    const gallery = document.getElementById('gallery');

    // Dynamically determine the media directory based on the current HTML file name
    const currentFileName = window.location.pathname.split('/').pop().split('.').shift();
    const jsonUrl = `../event/galleries/${currentFileName}/file-list.json`;

    try {
        // Fetch the file-list.json
        const response = await fetch(jsonUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${jsonUrl}: ${response.statusText}`);
        }
        const fileList = await response.json();

        // Construct URLs for each file
        const baseUrl = `../event/galleries/${currentFileName}/`;
        galleryItems = fileList.map(fileName => `${baseUrl}${fileName}`);

        // Loop through files and add them to the gallery
        for (const [index, mediaPath] of galleryItems.entries()) {
            const div = document.createElement('div');
            div.className = 'gallery-item';
            div.dataset.index = index;

            const isVideo = mediaPath.match(/\.(mp4|mov)$/i);

            if (isVideo) {
                const video = document.createElement('video');
                video.src = mediaPath;
                video.preload = 'metadata';
                video.playsInline = true;
                video.muted = true;

                div.appendChild(video);
            } else {
                const img = document.createElement('img');
                img.src = mediaPath;
                img.alt = mediaPath.split('/').pop().split('.')[0];
                div.appendChild(img);
            }

            gallery.appendChild(div);
        }
    } catch (error) {
        console.error('Error loading media:', error);
        gallery.innerHTML = '<p>Error loading gallery media.</p>';
    }
}

// Modal navigation
const modal = document.getElementById('modal');

function showModal(index) {
    currentIndex = index;
    const mediaPath = galleryItems[index];
    const isVideo = mediaPath.match(/\.(mp4|mov)$/i);

    // Clear existing modal content
    const modalContent = modal.querySelector('.modal-content');
    modalContent.innerHTML = ''; // Clear existing media

    if (isVideo) {
        const video = document.createElement('video');
        video.src = mediaPath;
        video.autoplay = true;
        video.playsInline = true;
        video.setAttribute('webkit-playsinline', ''); // Safari-specific
        video.controls = true;
        modalContent.appendChild(video);
    } else {
        const img = document.createElement('img');
        img.src = mediaPath;
        img.alt = mediaPath.split('/').pop().split('.')[0];
        modalContent.appendChild(img);
    }

    modal.style.display = 'block';
    document.body.classList.add('no-scroll'); // Prevent scrolling
    addModalEventListeners();
}

function closeModal() {
    modal.style.display = 'none';
    document.body.classList.remove('no-scroll'); // Re-enable scrolling
}

function navigateModal(direction) {
    currentIndex = (currentIndex + direction + galleryItems.length) % galleryItems.length;
    showModal(currentIndex);
}

let modalEventListenersAdded = false;

function addModalEventListeners() {
    if (modalEventListenersAdded) return; // Prevent duplicate listeners
    modalEventListenersAdded = true;

    const leftArrow = modal.querySelector('.arrow.left');
    const rightArrow = modal.querySelector('.arrow.right');

    // Arrow navigation
    leftArrow.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent background click
        navigateModal(-1);
    });

    rightArrow.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent background click
        navigateModal(1);
    });

    // Close modal when clicking on .modal-content but not its child elements (like img or video)
    const modalContent = modal.querySelector('.modal-content');
    modalContent.addEventListener('click', (e) => {
        if (e.target === modalContent) {
            closeModal(); // Close the modal
        }
    });

    // Prevent clicks on img or video from propagating to .modal-content
    const modalMediaElements = modalContent.querySelectorAll('img, video');
    modalMediaElements.forEach((media) => {
        media.addEventListener('click', (e) => e.stopPropagation());
    });

    // Close modal when clicking outside modal content (background)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(); // Close the modal
        }
    });
}

// Add close modal functionality for Escape key
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block' && e.key === 'Escape') {
        closeModal();
    }
});

// Swipe functionality
let startX = 0;

modal.addEventListener(
    'touchstart',
    (e) => {
        startX = e.touches[0].clientX;
    },
    { passive: true } // Improve performance
);

modal.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;

    if (diff > 50) {
        navigateModal(-1); // Swipe right
    } else if (diff < -50) {
        navigateModal(1); // Swipe left
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (modal.style.display === 'block') {
        if (e.key === 'ArrowLeft') {
            navigateModal(-1);
        } else if (e.key === 'ArrowRight') {
            navigateModal(1);
        } else if (e.key === 'Escape') {
            modal.style.display = 'none';
        }
    }
});

// Click event for opening modal
document.addEventListener('click', function (e) {
    if (e.target.closest('.gallery-item')) {
        const index = parseInt(e.target.closest('.gallery-item').dataset.index, 10);
        showModal(index);
    }
});

window.addEventListener('load', loadMedia);
