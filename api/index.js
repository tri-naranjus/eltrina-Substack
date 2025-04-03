
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await fetch('https://eltrina.substack.com/feed');
    const xml = await response.text();

    const $ = cheerio.load(xml, { xmlMode: true });
    const items = $('item');

    const posts = [];

    items.each((_, el) => {
      const title = $(el).find('title').text();
      const link = $(el).find('link').text();
      const pubDate = $(el).find('pubDate').text();
      const content = $(el).find('content\:encoded').text() || $(el).find('description').text();

      const $content = cheerio.load(content);
      const firstImg = $content('img').first().attr('src') || null;
      const firstText = $content('p').first().text().trim().slice(0, 300);

      posts.push({
        title,
        link,
        pubDate,
        image: firstImg,
        summary: firstText
      });
    });

    res.status(200).json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching or parsing Substack feed' });
  }
}
