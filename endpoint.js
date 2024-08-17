import fetch from 'node-fetch';
import ytdl from 'ytdl-core';
import { formatDistanceToNow } from 'date-fns';

// Utility function to get the time difference in a human-readable format
const getTimeDifference = (publishDate) => {
  const now = new Date();
  const publishDateTime = new Date(publishDate);
  return formatDistanceToNow(publishDateTime, { addSuffix: true });
};

export default async function youtube(url, isAudioOnly = false) {
  try {
    const BASE_URL = 'https://cobalt.tools';
    const BASE_API = 'https://api.cobalt.tools/api';

    // Get video info using ytdl-core
    const videoInfo = await ytdl.getInfo(url);
    const { title, author, lengthSeconds, viewCount, publishDate, formats } = videoInfo.videoDetails;

    // Determine the size of the video or audio
    const format = ytdl.chooseFormat(formats, { quality: isAudioOnly ? 'highestaudio' : 'highestvideo' });
    const size = format.contentLength ? format.contentLength / (1024 * 1024) : 'Unknown';

    // Calculate the time difference since the video was published
    const timeSincePublished = getTimeDifference(publishDate);

    // Send a preflight request to handle CORS
    await fetch(BASE_API + '/json', {
      method: 'OPTIONS',
      headers: {
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        origin: BASE_URL,
        referer: BASE_URL,
      },
    });

    // Send a POST request to the API to download the YouTube video
    const res = await fetch(BASE_API + '/json', {
      method: 'POST',
      headers: {
        origin: BASE_URL,
        referer: BASE_URL,
        'user-agent': BASE_URL,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        url: url,
        filenamePattern: 'basic',
        isAudioOnly: isAudioOnly,
        disableMetaData: true,
      }),
    }).then((v) => v.json());

    // Get the stream from the API response
    const stream = await fetch(res.url);

    return {
      status: stream.status,
      url: stream.url,
      title: title,
      author: author.name,
      views: viewCount,
      lengthSeconds: lengthSeconds,
      size: size === 'Unknown' ? size : `${size.toFixed(2)} MB`,
      publishDate: publishDate,
      timeSincePublished: timeSincePublished,
    };
  } catch (e) {
    throw e;
  }
}
