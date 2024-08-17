import express from 'express';
import youtube from './endpoint.js';

const app = express();

app.get('/youtube/mp4', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      creator: 'Ethix-Xsid',
      status: 400,
      success: false,
      message: 'URL parameter is missing',
    });
  }
  try {
    const result = await youtube(url);
    if (result.status !== 200) {
      return res.status(result.status).json({
        creator: 'Ethix-Xsid',
        status: result.status,
        success: false,
        message: 'Failed to process YouTube URL',
        error: result.error || 'Unknown error',
      });
    }
    res.status(200).json({
      creator: 'Ethix-Xsid',
      status: 200,
      success: true,
      url: result.url,
      title: result.title,
      author: result.author,
      views: result.views,
      lengthSeconds: result.lengthSeconds,
      size: result.size,
      publishDate: result.publishDate,
      timeSincePublished: result.timeSincePublished,
    });
  } catch (error) {
    res.status(500).json({
      creator: 'Ethix-Xsid',
      status: 500,
      success: false,
      message: 'An error occurred while processing the YouTube URL',
      error: error.message,
    });
  }
});

app.get('/youtube/mp3', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({
      creator: 'Ethix-Xsid',
      status: 400,
      success: false,
      message: 'URL parameter is missing',
    });
  }
  try {
    const result = await youtube(url, true);
    if (result.status !== 200) {
      return res.status(result.status).json({
        creator: 'Ethix-Xsid',
        status: result.status,
        success: false,
        message: 'Failed to process YouTube URL',
        error: result.error || 'Unknown error',
      });
    }
    res.status(200).json({
      creator: 'Ethix-Xsid',
      status: 200,
      success: true,
      url: result.url,
      title: result.title,
      author: result.author,
      views: result.views,
      lengthSeconds: result.lengthSeconds,
      size: result.size,
      publishDate: result.publishDate,
      timeSincePublished: result.timeSincePublished,
    });
  } catch (error) {
    res.status(500).json({
      creator: 'Ethix-Xsid',
      status: 500,
      success: false,
      message: 'An error occurred while processing the YouTube URL',
      error: error.message,
    });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server listening on port ' + (process.env.PORT || 3000));
});
