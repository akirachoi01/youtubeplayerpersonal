
const express = require('express');
const { google } = require('googleapis');
const router = express.Router();
const apiKey = process.env.YOUTUBE_API_KEY;

router.get('/search', async (req, res) => {
  const youtube = google.youtube({ version: 'v3', auth: apiKey });
  const { q } = req.query;
  const response = await youtube.search.list({
    part: 'snippet',
    q,
    maxResults: 5,
    type: 'video'
  });
  const results = response.data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.id.videoId
  }));
  res.json(results);
});

module.exports = router;
