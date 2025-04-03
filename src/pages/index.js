// pages/index.js
import ConvertImage from '../components/ConvertImage';

const Home = () => (
  <div>
    <h1>Convert Image to WebP</h1>
    <div style={{ marginBottom: '20px' }}>
      <span>Upload an image for PWA icons:</span>
      <ConvertImage />
    </div>
  </div>
);

export default Home;
