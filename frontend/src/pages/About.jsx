import '../../styles/about.css';
import aboutImg from '../../public/images/about-banner.jpg';

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-text">
          <h1>About Vibe Commerce</h1>
          <p>
            Welcome to <strong>Vibe Commerce</strong>, your destination for stylish,
            sustainable, and high-quality products. We believe in blending modern
            design with functionality — helping you create a space that truly reflects your vibe.
          </p>
          <p>
            Our mission is to make shopping simple, enjoyable, and inspiring.
            Every product in our collection is handpicked to meet the highest standards
            of quality and aesthetics.
          </p>
          <p>✨ Designed for your lifestyle. Delivered with care.</p>
        </div>

        <div className="about-image">
          <img src={aboutImg} alt="About Vibe Commerce" />
        </div>
      </div>
    </div>
  );
};

export default About;
