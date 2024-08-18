import fetch from 'node-fetch';

export default async function youtube(url, quality = 'default', isAudioOnly = false) {
  try {
    // Scrape video metadata using x2download.app
    const scrapeMetadata = async (videoUrl) => {
      const BASE_URL = 'https://x2download.app';
      const API_URL = `${BASE_URL}/api/ajaxSearch/`;

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          origin: BASE_URL,
          referer: BASE_URL,
          'user-agent': 'Mozilla/5.0',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: new URLSearchParams({ 'q': videoUrl, 'vt': 'mp4' }),
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

    // Fetch download links using cobalt.tools
    const BASE_URL = 'https://cobalt.tools';
    const BASE_API = `https://api.cobalt.tools/api`;

    // Send a preflight request to handle CORS
    await fetch(BASE_API + '/json', {
      method: 'OPTIONS',
      headers: {
        'access-control-request-method': 'POST',
        'access-control-request-headers': 'content-type',
        'user-agent': 'Mozilla/5.0',
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
        'user-agent': 'Mozilla/5.0',
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

    if (!res || !res.url) {
      throw new Error('Failed to get the download link from the API.');
    }

    const stream = await fetch(res.url);

    return {
      title: metadata.title,
      status: stream.status,
      quality: quality, // Echo the requested quality
      url: res.url, // Use the URL from the API response
    };
  } catch (e) {
    console.error('Error in youtube function:', e.message);
    throw e;
  }
}
