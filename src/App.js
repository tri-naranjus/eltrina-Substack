
import React, { useEffect, useState } from 'react';

function App() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api')
      .then((res) => res.json())
      .then((data) => setArticles(data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h1>Artículos de El Trina (Substack)</h1>
      {error && <p>Error: {error}</p>}
      {articles.map((post, index) => (
        <div key={index} style={{ marginBottom: 40 }}>
          <h2>
            <a href={post.link} target="_blank" rel="noopener noreferrer">
              {post.title}
            </a>
          </h2>
          <small>{post.pubDate}</small>
          {post.image && (
            <div style={{ margin: '10px 0' }}>
              <img src={post.image} alt="preview" style={{ maxWidth: '100%' }} />
            </div>
          )}
          <p>{post.summary}...</p>
        </div>
      ))}
    </div>
  );
}

export default App;
