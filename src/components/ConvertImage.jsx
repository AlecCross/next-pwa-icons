// components/ConvertImage.js
import { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from '../styles/container.module.css'

const ConvertImage = () => {
  const [images, setImages] = useState([]);
  const [resolutions] = useState([512, 384, 192, 180, 32, 16]); // Розміри
  const [activeTab, setActiveTab] = useState(0);

  const convertImage = async (event) => {
    if (!event.target.files.length) return;

    const src = URL.createObjectURL(event.target.files[0]);
    const image = new Image();
    image.src = src;

    image.onload = async () => {
      const newImages = await Promise.all(resolutions.map(async (size) => {
        if (image.width < size) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const ratio = image.width / image.height;
        canvas.width = size;
        canvas.height = Math.round(size / ratio);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        
        return {
          webp: canvas.toDataURL('image/webp', 0.8),
          ico: size <= 32 ? await canvasToIco(canvas) : null,
          size
        };
      }));

      setImages(newImages.filter(Boolean));
    };
  };

  const canvasToIco = (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'favicon.ico', { type: 'image/x-icon' });
        const url = URL.createObjectURL(file);
        resolve(url);
      }, 'image/x-icon');
    });
  };

  // Функція для збереження окремих файлів
  const saveImage = (format) => {
    const { webp, ico, size } = images[activeTab];
    const url = format === 'ico' ? ico : webp;
    const ext = format === 'ico' ? 'ico' : 'webp';

    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = `icon-${size}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Функція для збереження всіх зображень у ZIP
  const saveAllAsZip = async () => {
    if (images.length === 0) return;

    const zip = new JSZip();
    
    images.forEach(({ webp, ico, size }) => {
      if (webp) zip.file(`icon-${size}.webp`, webp.split(',')[1], { base64: true });
      if (ico) zip.file(`icon-${size}.ico`, ico.split(',')[1], { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'icons.zip');
  };

  return (
    <div className={styles.container}>
      <div className={styles.upload}>
        <span>Upload an image for PWA icons</span>
        <input type="file" accept="image/*" onChange={convertImage} />
      </div>
      <div className={styles.saveButtons}>
      {images.length > 0 && (
    <>
      <button className={styles.tab} onClick={saveAllAsZip}>Save All as ZIP</button>
      <button className={styles.tab} onClick={() => saveImage('webp')}>Save as WebP</button>
      {images[activeTab]?.ico && <button onClick={() => saveImage('ico')}>Save as ICO</button>}
    </>
  )}
      </div>
      <div className={styles.tabs}>
        {images.map((img, index) => (
          <button
            key={index}
            className={`${styles.tab} ${activeTab === index ? styles.active : ''}`}
            onClick={() => setActiveTab(index)}
          >
            {img.size}px
          </button>
        ))}
      </div>

      <div className={styles.imageContainer}>
        {images.length > 0 && (
          <img className={`${styles.image} ${styles['check-transparency']}`}  src={images[activeTab].webp} alt={`Icon ${images[activeTab].size}`} />
        )}
      </div>
    </div>
  );
};

export default ConvertImage;
