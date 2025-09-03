import * as THREE from 'three';
import { AudioManager } from './AudioManager';

/**
 * 3D六边形弹球游戏类
 * 实现在旋转六边形内弹跳的小球，包含重力、摩擦力和碰撞检测
 */
export class HexagonBallGame {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private hexagonGroup!: THREE.Group;
  private ball!: THREE.Mesh;
  private ballVelocity!: THREE.Vector3;
  private hexagonWalls: THREE.Mesh[] = [];
  private particles: THREE.Points[] = [];
  private audioManager: AudioManager;

  // 物理参数
  private readonly gravity = -0.0015;
  private readonly friction = 0.995;
  private readonly bounceDamping = 0.75;
  private readonly hexagonRadius = 2.5;
  private readonly hexagonHeight = 1.5;
  private readonly ballRadius = 0.08;

  // 旋转参数
  private hexagonRotationSpeed = 0.008;
  private time = 0;
  
  constructor(canvas: HTMLCanvasElement) {
    this.audioManager = new AudioManager();
    this.initScene(canvas);
    this.createHexagon();
    this.createBall();
    this.setupLighting();
    this.setupControls();
    this.animate();
  }

  /**
   * 初始化Three.js场景
   */
  private initScene(canvas: HTMLCanvasElement): void {
    // 创建场景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);
    
    // 创建相机
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 2, 6);
    this.camera.lookAt(0, 0, 0);
    
    // 创建渲染器
    this.renderer = new THREE.WebGLRenderer({ 
      canvas,
      antialias: true,
      alpha: true 
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setClearColor(0x0a0a0a, 1);
    
    // 处理窗口大小变化
    window.addEventListener('resize', () => this.onWindowResize());
  }

  /**
   * 创建六边形容器
   */
  private createHexagon(): void {
    this.hexagonGroup = new THREE.Group();
    
    // 创建六边形的六个面（墙壁）
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI) / 3;
      
      // 墙壁几何体
      const wallGeometry = new THREE.PlaneGeometry(1.2, this.hexagonHeight * 2);
      const wallMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(i / 6, 0.7, 0.6),
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      
      const wall = new THREE.Mesh(wallGeometry, wallMaterial);
      
      // 定位墙壁
      const x = Math.cos(angle) * this.hexagonRadius;
      const z = Math.sin(angle) * this.hexagonRadius;
      wall.position.set(x, 0, z);
      wall.rotation.y = angle + Math.PI / 2;
      
      // 启用阴影
      wall.receiveShadow = true;
      wall.castShadow = true;
      
      this.hexagonWalls.push(wall);
      this.hexagonGroup.add(wall);
    }
    
    // 创建底面
    const floorGeometry = new THREE.CylinderGeometry(this.hexagonRadius, this.hexagonRadius, 0.1, 6);
    const floorMaterial = new THREE.MeshPhongMaterial({
      color: 0x333333,
      transparent: true,
      opacity: 0.9
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.position.y = -this.hexagonHeight;
    floor.receiveShadow = true;
    this.hexagonGroup.add(floor);
    
    this.scene.add(this.hexagonGroup);
  }

  /**
   * 创建弹跳小球
   */
  private createBall(): void {
    const ballGeometry = new THREE.SphereGeometry(this.ballRadius, 32, 32);
    const ballMaterial = new THREE.MeshPhongMaterial({
      color: 0xff4444,
      shininess: 100,
      specular: 0x222222
    });
    
    this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
    this.ball.position.set(0, 0.5, 0);
    this.ball.castShadow = true;
    
    // 初始化球的速度
    this.ballVelocity = new THREE.Vector3(
      (Math.random() - 0.5) * 0.02,
      0,
      (Math.random() - 0.5) * 0.02
    );
    
    this.scene.add(this.ball);
  }

  /**
   * 设置光照
   */
  private setupLighting(): void {
    // 环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    this.scene.add(ambientLight);
    
    // 主光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    this.scene.add(directionalLight);
    
    // 点光源（跟随球移动）
    const pointLight = new THREE.PointLight(0xff6666, 0.5, 10);
    pointLight.position.copy(this.ball.position);
    this.scene.add(pointLight);
  }

  /**
   * 设置鼠标控制
   */
  private setupControls(): void {
    let isMouseDown = false;
    let mouseX = 0;
    let mouseY = 0;
    
    const canvas = this.renderer.domElement;
    
    canvas.addEventListener('mousedown', (event) => {
      isMouseDown = true;
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
    
    canvas.addEventListener('mousemove', (event) => {
      if (!isMouseDown) return;
      
      const deltaX = event.clientX - mouseX;
      const deltaY = event.clientY - mouseY;
      
      // 旋转相机
      const spherical = new THREE.Spherical();
      spherical.setFromVector3(this.camera.position);
      spherical.theta -= deltaX * 0.01;
      spherical.phi += deltaY * 0.01;
      spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
      
      this.camera.position.setFromSpherical(spherical);
      this.camera.lookAt(0, 0, 0);
      
      mouseX = event.clientX;
      mouseY = event.clientY;
    });
    
    canvas.addEventListener('mouseup', () => {
      isMouseDown = false;
    });
    
    // 滚轮缩放
    canvas.addEventListener('wheel', (event) => {
      const scale = event.deltaY > 0 ? 1.1 : 0.9;
      this.camera.position.multiplyScalar(scale);
      this.camera.position.clampLength(2, 15);
    });
  }

  /**
   * 更新物理模拟
   */
  private updatePhysics(): void {
    // 应用重力
    this.ballVelocity.y += this.gravity;
    
    // 应用摩擦力
    this.ballVelocity.multiplyScalar(this.friction);
    
    // 更新球的位置
    this.ball.position.add(this.ballVelocity);
    
    // 检查与地面的碰撞
    if (this.ball.position.y - this.ballRadius <= -this.hexagonHeight + 0.05) {
      this.ball.position.y = -this.hexagonHeight + 0.05 + this.ballRadius;

      // 只有当垂直速度足够大时才创建粒子效果和音效
      const impactIntensity = Math.abs(this.ballVelocity.y);
      if (impactIntensity > 0.01) {
        this.createCollisionParticles(new THREE.Vector3(
          this.ball.position.x,
          -this.hexagonHeight + 0.05,
          this.ball.position.z
        ));
        this.audioManager.playBounceSound(impactIntensity * 50);
      }

      this.ballVelocity.y = Math.abs(this.ballVelocity.y) * this.bounceDamping;
    }
    
    // 检查与六边形墙壁的碰撞
    this.checkWallCollisions();
  }

  /**
   * 检查与墙壁的碰撞
   */
  private checkWallCollisions(): void {
    const ballPos = this.ball.position.clone();
    const distance = Math.sqrt(ballPos.x * ballPos.x + ballPos.z * ballPos.z);

    // 如果球距离中心的距离超过六边形内切圆半径
    if (distance > this.hexagonRadius - this.ballRadius - 0.1) {
      // 计算碰撞法向量
      const normal = new THREE.Vector3(ballPos.x, 0, ballPos.z).normalize();

      // 将球推回到安全位置
      const targetDistance = this.hexagonRadius - this.ballRadius - 0.1;
      ballPos.normalize().multiplyScalar(targetDistance);
      this.ball.position.x = ballPos.x;
      this.ball.position.z = ballPos.z;

      // 反射速度向量
      const velocityDotNormal = this.ballVelocity.dot(normal);
      if (velocityDotNormal > 0) {
        const impactIntensity = velocityDotNormal;
        this.ballVelocity.sub(normal.multiplyScalar(2 * velocityDotNormal * this.bounceDamping));

        // 创建碰撞粒子效果和音效
        this.createCollisionParticles(this.ball.position.clone());
        this.audioManager.playCollisionSound(impactIntensity * 30);
      }
    }
  }

  /**
   * 创建碰撞粒子效果
   */
  private createCollisionParticles(position: THREE.Vector3): void {
    const particleCount = 20;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // 初始位置
      positions[i3] = position.x;
      positions[i3 + 1] = position.y;
      positions[i3 + 2] = position.z;

      // 随机速度
      velocities[i3] = (Math.random() - 0.5) * 0.1;
      velocities[i3 + 1] = Math.random() * 0.05;
      velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff6666,
      size: 0.02,
      transparent: true,
      opacity: 1.0
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = {
      velocities: velocities,
      life: 1.0,
      maxLife: 1.0
    };

    this.particles.push(particles);
    this.scene.add(particles);
  }

  /**
   * 更新粒子系统
   */
  private updateParticles(): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      const userData = particle.userData;

      // 更新生命周期
      userData.life -= 0.02;

      if (userData.life <= 0) {
        // 移除过期粒子
        this.scene.remove(particle);
        this.particles.splice(i, 1);
        continue;
      }

      // 更新透明度
      (particle.material as THREE.PointsMaterial).opacity = userData.life / userData.maxLife;

      // 更新粒子位置
      const positions = particle.geometry.attributes.position.array as Float32Array;
      const velocities = userData.velocities;

      for (let j = 0; j < positions.length; j += 3) {
        positions[j] += velocities[j];
        positions[j + 1] += velocities[j + 1];
        positions[j + 2] += velocities[j + 2];

        // 应用重力到粒子
        velocities[j + 1] += this.gravity * 2;
      }

      particle.geometry.attributes.position.needsUpdate = true;
    }
  }

  /**
   * 重置球的位置和速度
   */
  public resetBall(): void {
    this.ball.position.set(0, 0.5, 0);
    this.ballVelocity.set(
      (Math.random() - 0.5) * 0.02,
      0,
      (Math.random() - 0.5) * 0.02
    );
  }

  /**
   * 切换音效开关
   */
  public toggleAudio(): boolean {
    const newState = !this.audioManager.getEnabled();
    this.audioManager.setEnabled(newState);
    return newState;
  }

  /**
   * 处理窗口大小变化
   */
  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * 更新六边形颜色
   */
  private updateHexagonColors(): void {
    this.hexagonWalls.forEach((wall, index) => {
      const material = wall.material as THREE.MeshPhongMaterial;
      const hue = (index / 6 + this.time * 0.1) % 1;
      material.color.setHSL(hue, 0.7, 0.6);
    });
  }

  /**
   * 动画循环
   */
  private animate(): void {
    requestAnimationFrame(() => this.animate());

    this.time += 0.016; // 假设60fps

    // 旋转六边形
    this.hexagonGroup.rotation.y += this.hexagonRotationSpeed;

    // 更新六边形颜色
    this.updateHexagonColors();

    // 更新物理
    this.updatePhysics();

    // 更新粒子
    this.updateParticles();

    // 渲染场景
    this.renderer.render(this.scene, this.camera);
  }
}
