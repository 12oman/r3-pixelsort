import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import PixelSortShader from './components/PixelSortShader';

function App() {
    return (
        <Canvas>
            <PixelSortShader imageURL="https://64.media.tumblr.com/2e16039b21b38a934b5244f68a5dac7a/b3cceba71b83cfd4-32/s640x960/7392a920ddc2d5557978c470f804476cd944e361.webp" />
        </Canvas>
    );
}

export default App;

