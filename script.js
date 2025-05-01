const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    shuffleBtn = document.getElementById('shuffle'),
    repeatBtn = document.getElementById('repeat'),  // New repeat button
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    { path: 'assets/1.mp3', displayName: 'Meri Khamoshi hai', cover: 'assets/1.jpg', artist: 'Anupam Roy' },
    { path: 'assets/2.mp3', displayName: 'She forgot that I existed', cover: 'assets/2.jpg', artist: 'Josiah MacCartney' },
    { path: 'assets/3.mp3', displayName: 'Tere Bina', cover: 'assets/3.jpg', artist: 'A.R Rahman/Chinmayi' },
    { path: 'assets/4.mp3', displayName: 'Tere Pyaar Main', cover: 'assets/4.jpg', artist: 'Kaavish' },
    { path: 'assets/5.mp3', displayName: 'Faasle', cover: 'assets/5.jpg', artist: 'Kaavish' },
    { path: 'assets/6.mp3', displayName: 'Dooriyan', cover: 'assets/6.jpg', artist: 'Mohit Chauhan' },
    { path: 'assets/7.mp3', displayName: 'Piya tu Piya', cover: 'assets/7.jpg', artist: 'Arijit Singh/Chinmayi' },
    { path: 'assets/8.mp3', displayName: 'Bin Tere', cover: 'assets/8.jpg', artist: 'Shafqat Amanat Ali/Sunidhi Chauhan' },
    { path: 'assets/9.mp3', displayName: 'O Saajna', cover: 'assets/9.jpg', artist: 'Akhil Sachdeva' },
];

let musicIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;  // New variable for repeat mode
let shuffleQueue = [];

shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active');
    shuffleBtn.setAttribute('title', isShuffle ? 'Shuffle On' : 'Shuffle Off');
    if (isShuffle) {
        generateShuffleQueue();
    }
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active');
    repeatBtn.setAttribute('title', isRepeat ? 'Repeat On' : 'Repeat Off');
});

function generateShuffleQueue() {
    shuffleQueue = songs.map((_, i) => i).filter(i => i !== musicIndex);
    shuffleQueue = shuffleQueue.sort(() => Math.random() - 0.5);
}

function togglePlay() {
    isPlaying ? pauseMusic() : playMusic();
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(song) {
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;
}

function getNextIndex(direction) {
    if (isShuffle && direction === 1) {
        if (shuffleQueue.length === 0) {
            generateShuffleQueue();
        }
        return shuffleQueue.shift();
    } else {
        return (musicIndex + direction + songs.length) % songs.length;
    }
}

function changeMusic(direction) {
    musicIndex = getNextIndex(direction);
    loadMusic(songs[musicIndex]);
    playMusic();
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

// Event Listeners
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => {
    if (isRepeat) {
        music.play(); // Replay the current song
    } else {
        changeMusic(1); // Play next song when the song ends
    }
});
music.addEventListener('timeupdate', updateProgressBar);
playerProgress.addEventListener('click', setProgressBar);

// Init
loadMusic(songs[musicIndex]);
