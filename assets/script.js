
const player = new Audio();
let playlist = [], currentIndex = 0;

function playTrack(index) {
  currentIndex = index;
  const videoId = playlist[index].videoId;
  fetch(`/api/stream?videoId=${videoId}`).then(res => {
    player.src = res.url;
    player.play();
    document.querySelector('.title').textContent = playlist[index].title;
  });
}

document.getElementById('ytSearch').addEventListener('input', async (e) => {
  const q = e.target.value;
  if (q.length < 3) return;
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  const container = document.getElementById('searchResults');
  container.innerHTML = '';
  data.forEach((video, i) => {
    const div = document.createElement('div');
    div.className = 'yt-result';
    div.textContent = video.title;
    div.onclick = () => {
      playlist.push(video);
      playTrack(playlist.length - 1);
    };
    container.appendChild(div);
  });
});

document.getElementById('play-btn').onclick = () => {
  if (player.paused) player.play();
  else player.pause();
};
document.getElementById('next').onclick = () => {
  if (currentIndex + 1 < playlist.length) playTrack(currentIndex + 1);
};
document.getElementById('prev').onclick = () => {
  if (currentIndex - 1 >= 0) playTrack(currentIndex - 1);
};

document.getElementById('saveBtn').onclick = async () => {
  await fetch('/api/save', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(playlist)
  });
  alert('Playlist saved to GitHub!');
};
