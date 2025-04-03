
import { JSDOM } from 'jsdom';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://eltrina.substack.com/feed');
    const xml = await response.text();

    const dom = new JSDOM();
    const parser = new dom.window.DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const items = xmlDoc.querySelectorAll('item');

    const posts = Array.from(items).map(item => {
      const title = item.querySelector('title')?.textContent;
      const link = item.querySelector('link')?.textContent;
      const pubDate = item.querySelector('pubDate')?.textContent;
      const description = item.querySelector('description')?.textContent || '';
      const contentEncoded = item.querySelector('content\:encoded')?.textContent || '';

      const html = contentEncoded || description;
      const doc = new JSDOM(html).window.document;
      const firstImg = doc.querySelector('img');
      const firstP = doc.querySelector('p');

      return {
        title,
        link,
        pubDate,
        image: firstImg?.src || null,
        summary: firstP?.textContent?.substring(0, 300) || ''
      };
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error parsing RSS feed' });
  }
}
