import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  width?: number;
  height?: number;
  onTreasureClick?: (treasureId: string) => void;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ 
  width = 400, 
  height = 300,
  onTreasureClick 
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  
  useEffect(() => {
    if (!mountRef.current) return;

    // Cena, câmera e renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f9ff);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Limpar mountRef antes de adicionar
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    
    // Luzes
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // Criar um tesouro simples (torus knot)
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xf59e0b,
      metalness: 0.3,
      roughness: 0.4,
      emissive: 0xd97706,
      emissiveIntensity: 0.2
    });
    
    const treasure = new THREE.Mesh(geometry, material);
    treasure.userData = { id: 'demo-treasure', clickable: true };
    scene.add(treasure);
    
    // Adicionar um pedestal
    const pedestalGeometry = new THREE.CylinderGeometry(1.2, 1.5, 0.3, 32);
    const pedestalMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x374151,
      metalness: 0.1,
      roughness: 0.8
    });
    const pedestal = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal.position.y = -1.5;
    scene.add(pedestal);
    
    // Raycaster para detecção de clique
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);
      
      if (intersects.length > 0) {
        const object = intersects[0].object;
        if (object.userData.clickable && onTreasureClick) {
          onTreasureClick(object.userData.id);
        }
      }
    };
    
    // Adicionar controles de rotação básica
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      targetRotationY = mouseX * Math.PI;
      targetRotationX = mouseY * Math.PI * 0.5;
    };
    
    const handleTouchMove = (event: TouchEvent) => {
      if (!mountRef.current || !event.touches[0]) return;
      
      const rect = renderer.domElement.getBoundingClientRect();
      const touch = event.touches[0];
      mouseX = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((touch.clientY - rect.top) / rect.height) * 2 + 1;
      
      targetRotationY = mouseX * Math.PI;
      targetRotationX = mouseY * Math.PI * 0.5;
    };
    
    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // Rotação suave baseada no mouse
      treasure.rotation.x += (targetRotationX - treasure.rotation.x) * 0.05;
      treasure.rotation.y += (targetRotationY - treasure.rotation.y) * 0.05;
      
      // Rotação automática quando não há interação
      if (Math.abs(targetRotationX) < 0.1 && Math.abs(targetRotationY) < 0.1) {
        treasure.rotation.y += 0.01;
      }
      
      renderer.render(scene, camera);
    };
    
    // Event listeners
    renderer.domElement.addEventListener('click', handleClick);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    
    // Iniciar animação
    animate();
    setSceneReady(true);
    
    // Cleanup
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (mountRef.current && renderer.domElement) {
        renderer.domElement.removeEventListener('click', handleClick);
        renderer.domElement.removeEventListener('mousemove', handleMouseMove);
        renderer.domElement.removeEventListener('touchmove', handleTouchMove);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      pedestalGeometry.dispose();
      pedestalMaterial.dispose();
    };
  }, [width, height, onTreasureClick]);
  
  return (
    <div className="relative">
      <div ref={mountRef} className="rounded-lg shadow-lg overflow-hidden" />
      {!sceneReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Carregando cena 3D...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThreeScene;