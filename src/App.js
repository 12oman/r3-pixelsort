import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import PixelSortShader from './components/PixelSortShader';
import Controls from './components/Controls';

function App() {
    const [threshold, setThreshold] = React.useState(0.15);
    const [intensity, setIntensity] = React.useState(1.0);

    return (
        <div style={{ width: '100vw', height: '100vh' }}>
            <Controls 
                threshold={threshold}
                setThreshold={setThreshold}
                intensity={intensity}
                setIntensity={setIntensity}
            />
            <Canvas 
                camera={{ position: [0, 0, 2], fov: 75 }}
                style={{ width: '100%', height: '100%' }}
            >
                <PixelSortShader threshold={threshold} intensity={intensity} />
            </Canvas>
        </div>
    );
}

export default App;

