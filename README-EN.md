# 3D Hexagon Ball Game

[中文](README.md) | [English](README-EN.md)

A 3D hexagon ball game built with Three.js, featuring a ball bouncing inside a rotating hexagonal container with realistic physics effects.

## 🎮 Game Features

### Physics Simulation
- **Gravity System**: Ball falls under gravity influence
- **Friction**: Ball gradually slows down during movement
- **Collision Detection**: Precise wall and ground collision detection
- **Elastic Bouncing**: Ball loses energy when bouncing off walls and ground

### Visual Effects
- **Rotating Hexagon**: Container continuously rotates to increase game difficulty
- **Dynamic Colors**: Hexagon wall colors change over time
- **Particle Effects**: Spark particles generated on collision
- **Real-time Shadows**: Dynamic lighting and shadow effects
- **3D Rendering**: Complete 3D scene rendering

### Audio System
- **Collision Sound**: Sound effects when ball hits walls
- **Bounce Sound**: Sound effects when ball bounces off ground
- **Sound Intensity**: Adjusts sound effects based on collision intensity
- **Audio Toggle**: Can enable/disable sound effects

### Interactive Controls
- **Mouse Drag**: Rotate view angle to observe the game
- **Wheel Zoom**: Adjust viewing distance
- **Reset Function**: One-click reset ball position
- **Audio Control**: Toggle sound effects on/off

## 🚀 Tech Stack

- **Three.js**: 3D graphics rendering
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool
- **Web Audio API**: Audio generation
- **CSS3**: Modern style design

## 📦 Installation and Running

### Prerequisites
- Node.js (recommended 16.0 or higher)
- pnpm package manager

### Install Dependencies
```bash
pnpm install
```

### Start Development Server
```bash
pnpm dev
```

The game will start at `http://localhost:5173/`

### Build Production Version
```bash
pnpm build
```

### Preview Production Version
```bash
pnpm preview
```

## 🎯 Gameplay

1. **Observe**: Ball bounces inside the rotating hexagonal container
2. **Control View**: Use mouse drag to rotate view angle, wheel to zoom
3. **Reset Ball**: Click "Reset Ball" button to restart
4. **Audio Control**: Click audio button to enable/disable sound

## 🔧 Game Parameters

You can adjust the following parameters in `src/HexagonBallGame.ts`:

- `gravity`: Gravity strength (default: -0.0015)
- `friction`: Friction coefficient (default: 0.995)
- `bounceDamping`: Bounce damping (default: 0.75)
- `hexagonRadius`: Hexagon radius (default: 2.5)
- `hexagonRotationSpeed`: Rotation speed (default: 0.008)

## 🎨 Customization

### Modify Colors
Modify wall colors in the `createHexagon()` method:
```typescript
const wallMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color().setHSL(i / 6, 0.7, 0.6), // Modify here
  transparent: true,
  opacity: 0.8
});
```

### Adjust Physics Effects
Modify physics parameters in the constructor:
```typescript
private readonly gravity = -0.0015;     // Gravity
private readonly friction = 0.995;      // Friction
private readonly bounceDamping = 0.75;  // Bounce damping
```

## 📱 Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Requires WebGL and Web Audio API support

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 🚀 Deployment

### Local Deployment
After building, the `dist` folder contains all static files that can be deployed to any static file server.

### Online Deployment Options
- **Vercel**: Connect GitHub repository for automatic deployment
- **Netlify**: Drag and drop `dist` folder to Netlify
- **GitHub Pages**: Use GitHub Actions for automatic deployment
- **Firebase Hosting**: Deploy using Firebase CLI

### Performance Optimization Suggestions
- Enable gzip compression
- Use CDN to accelerate Three.js library
- Enable browser caching
- Consider using Web Workers for complex calculations

## 🎮 Game Features

### Implemented Features ✅
- ✅ 3D hexagon container rotation
- ✅ Physics engine (gravity, friction, collision)
- ✅ Particle effects system
- ✅ Audio system (Web Audio API)
- ✅ Mouse interaction controls
- ✅ Responsive design
- ✅ Automated testing

### Expandable Features 🔮
- 🔮 Multiple balls bouncing simultaneously
- 🔮 Different material balls
- 🔮 Obstacles and power-ups
- 🔮 Scoring system
- 🔮 Level design
- 🔮 VR/AR support

## 📄 License

MIT License