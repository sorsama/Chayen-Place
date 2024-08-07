// components/Canvas.js
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000'); // Update with your server URL

const Canvas = ({ width, height, pixelSize, initialPixels = [], selectedColor }) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = width * pixelSize;
    canvas.height = height * pixelSize;
    const context = canvas.getContext('2d');
    setCtx(context);

    initialPixels.forEach(({ x, y, color }) => {
      context.fillStyle = color;
      context.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    });
  }, [width, height, pixelSize, initialPixels]);

  useEffect(() => {
    socket.on('pixelUpdate', ({ x, y, color }) => {
      drawPixel(x, y, color);
    });
  }, []);

  const drawPixel = (x, y, color) => {
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    }
  };

  const handleClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / pixelSize);
    const y = Math.floor((e.clientY - rect.top) / pixelSize);
    drawPixel(x, y, selectedColor); // Use the selected color
    socket.emit('drawPixel', { x, y, color: selectedColor });
  };

  return <canvas ref={canvasRef} onClick={handleClick}></canvas>;
};

export default Canvas;
