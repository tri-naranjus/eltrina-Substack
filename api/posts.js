
import cheerio from 'cheerio';

async function fetchHTML(url) {
  const res = await fetch(url);
  return await res.text();
}

export default async function handler(req, res) {
  try {
    const feed = await fetch('https://eltrina.substack.com/feed').then(r => r.text());
    const $ = cheerio.load(feed, { xmlMode: true });
    const items = $('item');

    const links = [];
    items.each((_, el) => {
      const link = $(el).find('link').text();
      links.push(link);
    });

    const posts = [];

    for (const link of links) {
      const html = await fetchHTML(link);
      const $html = cheerio.load(html);

      const title = $html('h1').first().text().trim();
      const pubDate = $html('time').first().attr('datetime') || '';
      const image = $html('img').first().attr('src') || null;
      const summary = $html('p').first().text().trim().slice(0, 300);

      posts.push({ title, link, pubDate, image, summary });
    }

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching or parsing posts' });
  }
}
