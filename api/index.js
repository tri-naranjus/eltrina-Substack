
export default async function handler(req, res) {
  try {
    const response = await fetch('https://eltrina.substack.com/feed');
    const xml = await response.text();
    res.status(200).send(xml);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching Substack feed' });
  }
}
