// pages/open-file.js

import { useEffect, useState } from "react";

export default function OpenFilePage() {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    if ("launchQueue" in window) {
      window.launchQueue.setConsumer(async (launchParams) => {
        if (!launchParams.files.length) return;

        const fileHandle = launchParams.files[0];
        const file = await fileHandle.getFile();
        const url = URL.createObjectURL(file);
        setFileUrl(url);
      });
    }
  }, []);

  return (
    <div>
      <h1>Відкрите зображення</h1>
      {fileUrl ? (
        <img src={fileUrl} alt="Opened File" style={{ maxWidth: "100%" }} />
      ) : (
        <p>Немає відкритих файлів</p>
      )}
    </div>
  );
}
