// components/ConvertImage.js
import { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from '../styles/container.module.css';

const Resolutions = [512, 384, 192, 180, 32, 16]; // Розміри

const ConvertImage = ({ files }) => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (files && files.length > 0) {
      convertImages(files);
    }
  }, [files]);

  const convertImages = async (fileList) => {
    const newImages = [];
    for (const file of fileList) {
      if (!file.type.startsWith('image/')) {
        console.error('Непідтримуваний тип файлу:', file.type);
        continue;
      }

      const src = URL.createObjectURL(file);
      const image = new Image();
      image.src = src;

      await new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });

      if (image.width === 0 || image.height === 0) {
        console.error('Помилка завантаження зображення');
        continue;
      }

      const resizedImages = await Promise.all(Resolutions.map(async (size) => {
        if (image.width < size) return null;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const ratio = image.width / image.height;
        canvas.width = size;
        canvas.height = Math.round(size / ratio);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        return {
          webp: canvas.toDataURL('image/webp', 0.8),
          size,
          originalFile: file.name,
        };
      }));
      newImages.push(...resizedImages.filter(Boolean));
      URL.revokeObjectURL(src);
    }
    setImages(newImages);
  };

  const saveImage = (format) => {
    if (images.length === 0) return;
    const { webp, size } = images[activeTab];
    const url = webp;
    const ext = 'webp';
    let downloadName = `icon-${size}.${ext}`;

    if (size === 32 && format === 'webp') {
      downloadName = `favicon.webp`;
    }

    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const saveAllAsZip = async () => {
    if (images.length === 0) return;

    const zip = new JSZip();
    let originalName = 'icons';

    if (images[0]?.originalFile) {
      originalName = images[0].originalFile.split('.').slice(0, -1).join('.');
    }

    images.forEach(({ webp, size }) => {
      const baseName = `icon-${size}`;
      if (webp) zip.file(`${baseName}.webp`, webp.split(',')[1], { base64: true });
      if (size === 32 && webp) {
        zip.file(`favicon.webp`, webp.split(',')[1], { base64: true });
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${originalName}.zip`);
  };

  const handleFileInputChange = (event) => {
    convertImages(Array.from(event.target.files));
  };

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleFileInputChange} ref={fileInputRef} />
      </div>
      <div className={styles.saveButtons}>
        {images.length > 0 && (
          <>
            <button className={styles.tab} onClick={saveAllAsZip}>Save All as ZIP</button>
            <button className={styles.tab} onClick={() => saveImage('webp')}>Save as WebP</button>
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
          <img
            className={`${styles.image} ${styles['check-transparency']}`}
            src={images[activeTab].webp}
            alt={`Icon ${images[activeTab].size}`}
          />
        )}
      </div>
    </div>
  );
};

export default ConvertImage;
