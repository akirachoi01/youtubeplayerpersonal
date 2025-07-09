 <script src="https://www.youtube.com/iframe_api"></script>
  <script>
    const YT_API_KEY = '';
    const GH_TOKEN = ''; 
    const GH_REPO = 'akirachoi01/ChatsNew';
    const GH_PATH = 'MusicPlayer/assets/playlist.json';

    let yt;
    let playlist = [];
    let idx = 0;

    function onYouTubeIframeAPIReady() {
      yt = new YT.Player('yt-player', {
        height:'0', width:'0', videoId:'',
        events:{
          onStateChange: e => {
            document.getElementById('play-btn').className = e.data === 1 ? 'fa fa-pause' : 'fa fa-play';
          }
        }
      });
    }

    document.getElementById('ytSearch').addEventListener('keypress', e => {
      if (e.key !== 'Enter') return;
      fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=5&q=${encodeURIComponent(e.target.value)}&key=${YT_API_KEY}`)
        .then(r => r.json())
        .then(data => {
          const html = data.items.map(v => `<div class="yt-result" data-id="${v.id.videoId}">${v.snippet.title}</div>`).join('');
          document.getElementById('searchResults').innerHTML = html;
          document.querySelectorAll('.yt-result').forEach(el => {
            el.onclick = () => {
              const vid = el.dataset.id;
              playlist.push({ title: el.innerText, youtubeId: vid });
              idx = playlist.length - 1;
              play(idx);
            };
          });
        });
    });

    function play(i) {
      const vid = playlist[i].youtubeId;
      yt.loadVideoById(vid);
      document.querySelector('.title').innerText = playlist[i].title;
    }

    document.getElementById('play-btn').onclick = () => {
      const st = yt.getPlayerState();
      st === 1 ? yt.pauseVideo() : yt.playVideo();
    };
    document.getElementById('prev').onclick = () => { idx = (idx - 1 + playlist.length) % playlist.length; play(idx); };
    document.getElementById('next').onclick = () => { idx = (idx + 1) % playlist.length; play(idx); };

    document.getElementById('saveBtn').onclick = () => {
      fetch(`https://api.github.com/repos/${GH_REPO}/contents/${GH_PATH}`, {
        method: 'GET',
        headers: { Authorization: `token ${GH_TOKEN}` }
      })
      .then(r => r.json())
      .then(data => {
        const sha = data.sha;
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(playlist, null, 2))));
        return fetch(`https://api.github.com/repos/${GH_REPO}/contents/${GH_PATH}`, {
          method: 'PUT',
          headers: { Authorization: `token ${GH_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'Update playlist', content, sha, branch: 'main' })
        });
      })
      .then(res => res.json())
      .then(() => alert('✅ Playlist saved to GitHub!'))
      .catch(err => { console.error(err); alert('❌ Failed saving playlist'); });
    };
  </script>
