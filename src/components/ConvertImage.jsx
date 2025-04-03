// components/ConvertImage.js
import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import styles from '../styles/container.module.css';

const Resolutions = [512, 384, 192, 180, 32, 16]; // Розміри

const ConvertImage = ({ files }) => {
  const [images, setImages] = useState([]);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (files && files.length > 0) {
      convertImages(files);
    }
  }, [files]);

  const convertImages = async (fileList) => {
    const newImages = [];
    for (const file of fileList) {
      // ... (той самий код обробки зображень, що й у SharePage)
    }
    setImages(newImages);
  };

  // ... (функції canvasToIco, saveImage, saveAllAsZip)

  return (
    <div className={styles.container}>
      {/* ... (той самий рендер, що й у SharePage) */}
    </div>
  );
};

export default ConvertImage;
