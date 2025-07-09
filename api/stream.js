
const express = require('express');
const router = express.Router();
const ytdlp = require('child_process');

router.get('/stream', (req, res) => {
  const { videoId } = req.query;
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const stream = ytdlp.spawn('yt-dlp', ['-f', 'bestaudio', '-g', url]);

  stream.stdout.on('data', data => {
    res.json({ url: data.toString().trim() });
  });

  stream.stderr.on('data', err => {
    res.status(500).send(err.toString());
  });
});

module.exports = router;
