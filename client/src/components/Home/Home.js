import React from 'react';
import Container from '../Container';

const Home = () => (
  <div className="home">
    <Container>
      <header>
        <h1>Blogggly</h1>
        <p>Start your own blog in seconds, for free!</p>
        <button type="button">Signup</button>
      </header>
      <section>
        <div className="features__card">
          Start a blog
        </div>
        <div className="features__card">
          Rich Text Editor
        </div>
        <div className="features__card">
          Free
        </div>
      </section>
    </Container>
  </div>
);

export default Home;
