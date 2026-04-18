import { useEffect, useRef, useState } from 'react';

/**
 * Qora fonli PNG rasmni canvas orqali shaffof qilib ko'rsatadi
 */
export default function TransparentImg({ src, alt, className, style }) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        // Qora va qora yaqin piksellarni shaffof qilish
        const brightness = (r + g + b) / 3;
        if (brightness < 30) {
          data[i + 3] = 0; // alpha = 0 (shaffof)
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL('image/png'));
    };
    img.src = src;
  }, [src]);

  if (!dataUrl) {
    // Yuklanayotganda yashirin placeholder
    return <div className={className} style={{ ...style, visibility: 'hidden' }} />;
  }

  return <img src={dataUrl} alt={alt} className={className} style={style} />;
}
