import React from 'react';

const Controls = ({ threshold, setThreshold, intensity, setIntensity }) => {
    return (
        <div style={{
            position: 'absolute',
            top: 20,
            left: 20,
            zIndex: 100,
            color: 'white',
            fontFamily: 'monospace',
            background: 'rgba(0,0,0,0.7)',
            padding: '15px',
            borderRadius: '5px'
        }}>
            <div>
                <label>Threshold: {threshold.toFixed(2)}</label>
                <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    style={{ width: '200px', marginLeft: '10px' }}
                />
            </div>
            <div style={{ marginTop: '10px' }}>
                <label>Intensity: {intensity.toFixed(2)}</label>
                <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={intensity}
                    onChange={(e) => setIntensity(parseFloat(e.target.value))}
                    style={{ width: '200px', marginLeft: '10px' }}
                />
            </div>
        </div>
    );
};

export default Controls;