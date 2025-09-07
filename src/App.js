import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import PixelSortShader from './components/PixelSortShader';

function App() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Canvas 
                camera={{ position: [0, 0, 2], fov: 75 }}
                style={{ width: '100%', height: '100%' }}
            >
                <PixelSortShader />
            </Canvas>
        </div>
    );
}

export default App;

