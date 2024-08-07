"use client"
import { useSession, signIn, signOut } from 'next-auth/react';
import Canvas from '../components/canvas.js';
import { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';

export default function Home() {
  const { data: session } = useSession();
  const [pixels, setPixels] = useState([]);
  const [color, setColor] = useState('#000000'); // Default color

  useEffect(() => {
    fetch('/api/pixels')
      .then((res) => res.json())
      .then((data) => setPixels(data));
  }, []);

  if (!session) {
    return (
      <div>
        <h1>Welcome to r/place Clone</h1>
        <button onClick={() => signIn()}>Sign in</button>
      </div>
    );
  }

  return (
    <div>
      <h1>r/place Clone</h1>
      <p>Signed in as {session.user.email}</p>
      <button onClick={() => signOut()}>Sign out</button>
      <SketchPicker color={color} onChangeComplete={(color) => setColor(color.hex)} />
      <Canvas width={100} height={100} pixelSize={10} initialPixels={pixels} selectedColor={color} />
    </div>
  );
}
