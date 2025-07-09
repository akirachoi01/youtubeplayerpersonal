
const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

const owner = 'akirachoi01';
const repo = 'ChatsNew';
const path = 'MusicPlayer/assets/playlist.json';

router.post('/save', async (req, res) => {
  const content = Buffer.from(JSON.stringify(req.body, null, 2)).toString('base64');
  const { data: file } = await octokit.repos.getContent({ owner, repo, path });
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: 'Update playlist.json',
    content,
    sha: file.sha
  });
  res.json({ success: true });
});

module.exports = router;
