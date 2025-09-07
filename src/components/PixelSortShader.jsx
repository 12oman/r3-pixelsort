import React from 'react';
import { useLoader } from '@react-three/fiber';
// import { TextureLoader } from 'three';
import { TextureLoader, VideoTexture, NearestFilter, LinearFilter, RGBAFormat } from 'three';



const fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uTexture;

    void main() {
        vec4 color = texture2D(uTexture, vUv);
        // Implement your pixel-sorting shader logic here...
        gl_FragColor = color;
    }
`;

const PixelSortShader = () => {
    const [videoTexture, setVideoTexture] = React.useState(null);

    React.useEffect(() => {
        const video = document.createElement('video');
        
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                video.srcObject = stream;
                video.play();

                const texture = new VideoTexture(video);
                texture.minFilter = LinearFilter;
                texture.magFilter = LinearFilter;
                texture.format = RGBAFormat;

                setVideoTexture(texture);
            })
            .catch((err) => {
                console.error("Error accessing webcam:", err);
            });

        return () => {
            const tracks = video.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        };
    }, []);

    if (!videoTexture) {
        return null;
    }

    return (
        <mesh>
            <planeBufferGeometry args={[1, 1]} />

            <shaderMaterial
                attach="material"
                args={[{
                    fragmentShader,
                    uniforms: {
                        uTexture: { value: videoTexture }
                    }
                }]}
            />
        </mesh>
    );
};


export default PixelSortShader;
