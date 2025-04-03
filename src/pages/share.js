import { useEffect, useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from '../styles/container.module.css';

const Resolutions = [512, 384, 192, 180, 32, 16];

const SharePage = () => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [receivedSharedData, setReceivedSharedData] = useState(false);

  useEffect(() => {
    if ('launchQueue' in window && 'files' in window.launchQueue) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (!launchParams.files.length) return;

        setReceivedSharedData(true); // Indicate that we've received shared data

        const newImages = [];

        for (const fileHandle of launchParams.files) {
          const file = await fileHandle.getFile();
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
              ico: size <= 32 ? await canvasToIco(canvas) : null,
              size,
              originalFile: file.name,
            };
          }));

          newImages.push(...resizedImages.filter(Boolean));
          URL.revokeObjectURL(src);
        }

        setImages(newImages);
      });
    }
  }, []);

  const canvasToIco = (canvas) => {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'favicon.ico', { type: 'image/x-icon' });
        const url = URL.createObjectURL(file);
        resolve(url);
      }, 'image/x-icon');
    });
  };

  const saveImage = (format) => {
    if (images.length === 0) return;
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

  const saveAllAsZip = async () => {
    if (images.length === 0) return;

    const zip = new JSZip();

    images.forEach(({ webp, ico, size, originalFile }) => {
      const fileName = originalFile ? originalFile.split('.').slice(0, -1).join('.') : 'icon';

      if (webp) zip.file(`${fileName}-${size}.webp`, webp.split(',')[1], { base64: true });
      if (ico && size <= 32) zip.file(`${fileName}-${size}.ico`, ico.split(',')[1], { base64: true });
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'icons.zip');
  };

  return (
    <div className={styles.container}>
      <h1>Convert Image to WebP (Shared)</h1>
      {!receivedSharedData && <p>Очікування зображення для обробки...</p>} {/* Added this line */}
      {images.length > 0 && (
        <>
          <div className={styles.saveButtons}>
            <button className={styles.tab} onClick={saveAllAsZip}>Save All as ZIP</button>
            <button className={styles.tab} onClick={() => saveImage('webp')}>Save as WebP</button>
            {images[activeTab]?.ico && images[activeTab].size <= 32 && <button onClick={() => saveImage('ico')}>Save as ICO</button>}
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
            <img
              className={`${styles.image} ${styles['check-transparency']}`}
              src={images[activeTab].webp}
              alt={`Icon ${images[activeTab].size}`}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default SharePage;