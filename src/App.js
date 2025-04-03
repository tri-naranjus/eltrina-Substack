
import React, { useEffect, useState } from 'react';

function App() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.text())
      .then((xml) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xml, 'text/xml');
        const items = xmlDoc.querySelectorAll('item');
        const posts = Array.from(items).map((item) => ({
          title: item.querySelector('title')?.textContent,
          link: item.querySelector('link')?.textContent,
          pubDate: item.querySelector('pubDate')?.textContent,
        }));
        setArticles(posts);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Artículos de El Trina (Substack)</h1>
      {error && <p>Error: {error}</p>}
      <ul>
        {articles.map((post, index) => (
          <li key={index}>
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
            <br />
            <small>{post.pubDate}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
