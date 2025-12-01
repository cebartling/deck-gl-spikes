import { Link } from 'react-router-dom';

function About() {
  return (
    <>
      <h1>About</h1>
      <p>
        This is a React + TypeScript spike project for experimenting with
        deck.gl visualization library.
      </p>
      <nav>
        <Link to="/">Go to Home</Link>
      </nav>
    </>
  );
}

export default About;
