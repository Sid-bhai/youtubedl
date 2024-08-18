import fetch from 'node-fetch';

export default async function youtube(url, quality, isAudioOnly = false) {
  try {
    // Part 1: Scrape video metadata using x2download.app
    const scrapeMetadata = async (videoUrl) => {
      const BASE_URL = 'https://x2download.app';
      const API_URL = 'https://x2download.app/api/ajaxSearch/';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          origin: BASE_URL,
          referer: BASE_URL,
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams({
          'q': videoUrl,
          'vt': 'mp4'
        })
      });

      const text = await response.text();
      const jsonResponse = JSON.parse(text);

      if (jsonResponse && jsonResponse.links && jsonResponse.links.mp4) {
        const title = jsonResponse.title;
        return { title };
      } else {
        throw new Error('Failed to scrape video metadata.');
      }
    };

    const metadata = await scrapeMetadata(url);

    // Part 2: Fetch download links using cobalt.tools
    const BASE_URL = 'https://cobalt.tools';
    const BASE_API = 'https://api.cobalt.tools/api';

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
        vQuality: quality,
        filenamePattern: 'basic',
        isAudioOnly: isAudioOnly,
        disableMetaData: true,
      }),
    }).then((v) => v.json());

    // Get the stream from the API response
    const stream = await fetch(res.url);

    return {
      title: metadata.title, // Include the title in the response
      status: stream.status,
      quality: stream.vQuality,
      url: stream.url,
    };
  } catch (e) {
    throw e;
  }
}
