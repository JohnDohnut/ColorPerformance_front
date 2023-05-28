import './App.css';
import './FullScreen.css';
import React from 'react';
import CamHandler from './CamHandler';
import {useEffect, useState} from 'react';
import axios from 'axios';

import { w3cwebsocket as WebSocketClient } from 'websocket';


function App() {
  const [webcamRef, setRef] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [receivedImage, setRecievedImage] = useState(null);
  const [presetValue, setPresetValue] = useState('');
  const [websocket, setWebsocket] = useState(null);
  const numberOptions = ['1', '2', '3', '4', '5'];

  const option = {}
  
  useEffect(() => {
    if (capturedImage && websocket) {
      sendImageToServer(capturedImage);
    }
  }, [capturedImage, websocket]);

  const changePresetValue = (e) =>{
    const number = e.target.value;
    setPresetValue(number);
  }


  //transmission

  const sendImageToServer = (imageData) => {
    const imageSet = new FormData();
    imageSet.append('image', capturedImage);
    imageSet.append('preset', presetValue);

    axios.post("url", imageSet, {
      responseType: 'arraybuffer'
    })
    .then((response)=>{
      const imageArrayBuffer = response.data;
      const imageBlob = new Blob([imageArrayBuffer], {type: 'image/jpeg'});
      const imageUrl = URL.createObjectURL(imageBlob);
      setRecievedImage(imageUrl)
    })
    .catch((error) => {
      alert('fail')
      console.error(error);
    })
  };


  const captureDetector = useEffect(() => {
    if(capturedImage){
      alert('capture')
      sendImageToServer();
    }
  }, [capturedImage]);

  

  return (
     
    <div className="App">
      <CamHandler setRef = {setRef} capturedImage = {capturedImage} setCapturedImage = {setCapturedImage}/>
      <h2>CAPTURED IMAGE</h2>
      <img src = {capturedImage} />
      <h2>recievedImage</h2>
      <div>
        <select value = {presetValue} onChange={changePresetValue}>
          {numberOptions.map((number) => (
            <option key= {number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </div>
      <img src = {receivedImage} />
    </div>
    /**
    <div className='fullscreen-image'>
      <img src={testImage}/>    
      </div>
    */
  );
}

export default App;
