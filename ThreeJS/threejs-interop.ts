import * as THREE from 'three';

interface ThreeJsInterop {
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    renderer: THREE.WebGLRenderer | null;
    cube: THREE.Mesh | null;
    dotNetReference: any;
    initialize(containerElement: HTMLElement, dotNetRef: any): void;
    animate(): void;
    dispose(): void;
    setCubeColor(hexColor: string): void;
}

export {};

declare global {
    interface Window {
        threeJsInterop: ThreeJsInterop;
    }
}

window.threeJsInterop = {
    scene: null,
    camera: null,
    renderer: null,
    cube: null,
    dotNetReference: null,

    initialize(containerElement: HTMLElement, dotNetRef: any): void {
        this.dotNetReference = dotNetRef;
        
        // Create scene
        this.scene = new THREE.Scene();
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Create renderer
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        containerElement.appendChild(this.renderer.domElement);

        // Create a cube
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
        this.cube = new THREE.Mesh(geometry, material);
        this.scene.add(this.cube);

        // Start animation
        this.animate();
    },

    animate(): void {
        requestAnimationFrame(() => this.animate());

        // Rotate the cube
        if (this.cube) {
            this.cube.rotation.x += 0.01;
            this.cube.rotation.y += 0.01;

            // Check for full rotation (2π radians = 360 degrees)
            if (this.cube.rotation.x >= Math.PI * 2) {
                this.cube.rotation.x = 0;
                // Notify Blazor about the rotation completion
                if (this.dotNetReference) {
                    this.dotNetReference.invokeMethodAsync('OnRotationComplete');
                }
            }
        }

        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    },

    setCubeColor(hexColor: string): void {
        if (this.cube && this.cube.material instanceof THREE.MeshBasicMaterial) {
            this.cube.material.color.setHex(parseInt(hexColor.replace('#', '0x')));
        }
    },

    dispose(): void {
        if (this.renderer) {
            this.renderer.dispose();
        }
        this.dotNetReference = null;
    }
};