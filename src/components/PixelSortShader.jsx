import React from 'react';
import { useFrame } from '@react-three/fiber';
// import { TextureLoader } from 'three';
import { TextureLoader, VideoTexture, NearestFilter, LinearFilter, RGBAFormat } from 'three';



const vertexShader = `
    varying vec2 vUv;

    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

const fragmentShader = `
    precision highp float;

    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uThreshold;
    uniform float uIntensity;

    // Convert RGB to luminance for brightness comparison
    float getLuminance(vec3 color) {
        return dot(color, vec3(0.299, 0.587, 0.114));
    }

    void main() {
        vec2 uv = vUv;
        vec2 texelSize = vec2(1.0) / vec2(textureSize(uTexture, 0));
        
        // Determine sorting interval based on brightness threshold
        vec4 currentColor = texture2D(uTexture, uv);
        float currentBrightness = getLuminance(currentColor.rgb);
        
        // Find start and end of sorting interval
        float intervalStart = uv.x;
        float intervalEnd = uv.x;
        
        // Search backwards to find interval start - bigger intervals
        for(float i = 0.0; i < 100.0; i++) {
            float testX = uv.x - i * texelSize.x * 1.0;
            if(testX < 0.0) break;
            
            vec4 testColor = texture2D(uTexture, vec2(testX, uv.y));
            float testBrightness = getLuminance(testColor.rgb);
            
            if(abs(testBrightness - currentBrightness) > uThreshold) {
                intervalStart = testX + texelSize.x * 1.0;
                break;
            }
            intervalStart = testX;
        }
        
        // Search forwards to find interval end - bigger intervals
        for(float i = 0.0; i < 100.0; i++) {
            float testX = uv.x + i * texelSize.x * 1.0;
            if(testX > 1.0) break;
            
            vec4 testColor = texture2D(uTexture, vec2(testX, uv.y));
            float testBrightness = getLuminance(testColor.rgb);
            
            if(abs(testBrightness - currentBrightness) > uThreshold) {
                intervalEnd = testX - texelSize.x * 1.0;
                break;
            }
            intervalEnd = testX;
        }
        
        // Calculate position within interval based on brightness ranking
        float intervalWidth = intervalEnd - intervalStart;
        if(intervalWidth > texelSize.x * 3.0) { // Sort even smaller intervals
            
            // Sample more points for better sorting approximation
            float brightnessRank = 0.0;
            float totalSamples = 0.0;
            
            for(float i = 0.0; i < 40.0; i++) {
                float sampleX = intervalStart + (i / 39.0) * intervalWidth;
                vec4 sampleColor = texture2D(uTexture, vec2(sampleX, uv.y));
                float sampleBrightness = getLuminance(sampleColor.rgb);
                
                if(sampleBrightness < currentBrightness) {
                    brightnessRank += 1.0;
                }
                totalSamples += 1.0;
            }
            
            // Position based on brightness rank with more dramatic sorting
            float normalizedRank = brightnessRank / totalSamples;
            float sortedX = intervalStart + normalizedRank * intervalWidth;
            
            // Apply more intense sorting with exponential curve
            float sortingStrength = uIntensity * uIntensity; // Square for more intensity
            float finalX = mix(uv.x, sortedX, sortingStrength);
            
            vec4 finalColor = texture2D(uTexture, vec2(finalX, uv.y));
            gl_FragColor = finalColor;
        } else {
            // Even for small intervals, apply some sorting
            float sortedX = mix(uv.x, intervalStart + currentBrightness * intervalWidth, uIntensity * 0.5);
            vec4 finalColor = texture2D(uTexture, vec2(sortedX, uv.y));
            gl_FragColor = finalColor;
        }
    }
`;

const PixelSortShader = ({ threshold, intensity }) => {
    const [videoTexture, setVideoTexture] = React.useState(null);
    const shaderRef = React.useRef();

    // Create reactive uniforms
    const uniforms = React.useMemo(() => ({
        uTexture: { value: videoTexture },
        uTime: { value: 0 },
        uThreshold: { value: threshold },
        uIntensity: { value: intensity }
    }), [videoTexture, threshold, intensity]);

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
            if (video.srcObject) {
                const tracks = video.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    // Update shader uniforms on every frame
    useFrame((state) => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = state.clock.elapsedTime;
            shaderRef.current.uniforms.uThreshold.value = threshold;
            shaderRef.current.uniforms.uIntensity.value = intensity;
        }
    });

    // Also update uniforms when props change
    React.useEffect(() => {
        if (shaderRef.current) {
            shaderRef.current.uniforms.uThreshold.value = threshold;
            shaderRef.current.uniforms.uIntensity.value = intensity;
        }
    }, [threshold, intensity]);

    if (!videoTexture) {
        return null;
    }

    return (
        <mesh>
            <planeGeometry args={[4, 3]} />
            <shaderMaterial
                ref={shaderRef}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={{
                    uTexture: { value: videoTexture },
                    uTime: { value: 0 },
                    uThreshold: { value: threshold },
                    uIntensity: { value: intensity }
                }}
            />
        </mesh>
    );
};


export default PixelSortShader;
