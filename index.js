import express from 'express';
import youtube from './endpoint.js';

const app = express();

app.get('/youtube/quality', async (req, res) => {
  const { url, quality } = req.query;
  
  if (!url || !quality) {
    return res.status(400).json({
      creator: 'Ethix-Xsid',
      status: 400,
      success: false,
      message: 'URL or quality parameter is missing',
    });
  }
  
  try {
    const result = await youtube(url, quality, false);
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
      title: result.title,
      type: 'video',
      quality: result.quality,
      url: result.url,
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
      title: result.title,
      type: 'video',
      url: result.url,
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
      title: result.title,
      type: 'audio',
      url: result.url,
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
