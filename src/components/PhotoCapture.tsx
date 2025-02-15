"use client";
// components/PhotoCapture.tsx
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export const PhotoCapture: React.FC = () => {
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null); 
  const streamRef = useRef<MediaStream | null>(null); // Store the video stream to stop it later

  // Start the video stream (camera)
  const startCamera = async () => {
    try {
      const video = videoRef.current;
      if (video) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera: ', err);
    }
  };

  const stopCamera= () => {
    const video = videoRef.current;
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks (video and audio if available)
      }
  }

  // Capture photo and convert it to base64
  const capturePhoto = () => {
    stopCamera();
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas dimensions to match video feed
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current video frame onto the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas image to base64
        const imageBase64 = canvas.toDataURL('image/jpeg');
        setBase64Image(imageBase64);
      }
    }
  };

  const tryAgain = ()=> {
    setBase64Image(null);
    startCamera()
    // setBase64Image(null);
   
  }

  const sendToEmail = () => {

  }

  // Start camera when the component is mounted
  useEffect(() => {
    startCamera();
    return () => {
        stopCamera();
    };
  }, []);

  return (
    <div>
      <h1>Capture Photo</h1>
     
      {base64Image ? (
        <div>
          <h2>Captured Photo:</h2>
          {base64Image && <Image src={base64Image} alt="Captured" width={400} height={300}/>}
          
          <h3>Base64 String:</h3>
          <textarea value={base64Image} readOnly rows={10} style={{ width: '100%' }} />
        </div>
      ) :  <div>
      <video ref={videoRef} width="100%" height="auto" autoPlay></video>
    </div>}
      <div className='flex justify-between'>
        <button onClick={capturePhoto}>Capture Photo</button>
        <button onClick={tryAgain}>Try Again</button>
        <button onClick={sendToEmail}>Send to Email</button>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </div>
  );
}; 
