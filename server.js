const express = require('express');
const ytdl = require('@distube/ytdl-core');

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint for audio download
app.get('/ytdl/audio', async (req, res) => {
  const url = req.query.url;

  if (url) {
    try {
      const info = await ytdl.getInfo(url);
      const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
      audioFormats.sort((a, b) => b.audioBitrate - a.audioBitrate);
      const audioURL = audioFormats[0]?.url;

      if (audioURL) {
        res.json({
          title: info.videoDetails.title,
          audioURL: audioURL,
        });
      } else {
        res.status(404).json({ error: 'Audio format not available.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Please provide a valid YouTube URL.' });
  }
});

// Endpoint for video download
app.get('/ytdl/video', async (req, res) => {
  const url = req.query.url;

  if (url) {
    try {
      const info = await ytdl.getInfo(url);
      const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
      const videoURL = videoFormats.find(format => format.qualityLabel) ?.url;

      if (videoURL) {
        res.json({
          title: info.videoDetails.title,
          videoURL: videoURL,
        });
      } else {
        res.status(404).json({ error: 'Video format not available.' });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Please provide a valid YouTube URL.' });
  }
});

// Endpoint for specific video quality download
app.get('/ytdl/video_quality', async (req, res) => {
  const { quality, url } = req.query;

  if (url && quality) {
    try {
      const info = await ytdl.getInfo(url);
      const format = ytdl.filterFormats(info.formats, 'videoandaudio')
        .find(format => format.qualityLabel === quality);

      if (format) {
        res.json({
          title: info.videoDetails.title,
          quality: quality,
          videoURL: format.url,
        });
      } else {
        res.status(404).json({ error: `Video quality ${quality} not available.` });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(400).json({ message: 'Please provide a valid YouTube URL and quality.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
