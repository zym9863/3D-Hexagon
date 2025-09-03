# 3D 六边形弹球游戏

一个使用 Three.js 构建的3D六边形弹球游戏，小球在旋转的六边形容器内弹跳，具有逼真的物理效果。

## 🎮 游戏特性

### 物理模拟
- **重力系统**: 小球受到重力影响向下坠落
- **摩擦力**: 小球运动时会逐渐减速
- **碰撞检测**: 精确的墙壁和地面碰撞检测
- **弹性反弹**: 小球从墙壁和地面反弹时有能量损失

### 视觉效果
- **旋转六边形**: 容器持续旋转增加游戏难度
- **动态颜色**: 六边形墙壁颜色随时间变化
- **粒子效果**: 碰撞时产生火花粒子
- **实时阴影**: 动态光照和阴影效果
- **3D渲染**: 完整的3D场景渲染

### 音效系统
- **碰撞音效**: 小球撞击墙壁时的音效
- **弹跳音效**: 小球从地面弹起时的音效
- **音效强度**: 根据碰撞强度调整音效
- **音效开关**: 可以开启/关闭音效

### 交互控制
- **鼠标拖拽**: 旋转视角观察游戏
- **滚轮缩放**: 调整观察距离
- **重置功能**: 一键重置小球位置
- **音效控制**: 切换音效开关

## 🚀 技术栈

- **Three.js**: 3D图形渲染
- **TypeScript**: 类型安全的JavaScript
- **Vite**: 快速的构建工具
- **Web Audio API**: 音效生成
- **CSS3**: 现代样式设计

## 📦 安装和运行

### 前置要求
- Node.js (推荐 16.0 或更高版本)
- pnpm 包管理器

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

游戏将在 `http://localhost:5173/` 启动

### 构建生产版本
```bash
pnpm build
```

### 预览生产版本
```bash
pnpm preview
```

## 🎯 游戏玩法

1. **观察**: 小球在旋转的六边形容器内弹跳
2. **控制视角**: 使用鼠标拖拽旋转视角，滚轮缩放
3. **重置小球**: 点击"重置小球"按钮重新开始
4. **音效控制**: 点击音效按钮开启/关闭声音

## 🔧 游戏参数

可以在 `src/HexagonBallGame.ts` 中调整以下参数：

- `gravity`: 重力强度 (默认: -0.0015)
- `friction`: 摩擦系数 (默认: 0.995)
- `bounceDamping`: 弹跳阻尼 (默认: 0.75)
- `hexagonRadius`: 六边形半径 (默认: 2.5)
- `hexagonRotationSpeed`: 旋转速度 (默认: 0.008)

## 🎨 自定义

### 修改颜色
在 `createHexagon()` 方法中修改墙壁颜色：
```typescript
const wallMaterial = new THREE.MeshPhongMaterial({
  color: new THREE.Color().setHSL(i / 6, 0.7, 0.6), // 修改这里
  transparent: true,
  opacity: 0.8
});
```

### 调整物理效果
在构造函数中修改物理参数：
```typescript
private readonly gravity = -0.0015;     // 重力
private readonly friction = 0.995;      // 摩擦力
private readonly bounceDamping = 0.75;  // 弹跳阻尼
```

## 📱 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

需要支持 WebGL 和 Web Audio API

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## � 部署

### 本地部署
构建完成后，`dist` 文件夹包含所有静态文件，可以部署到任何静态文件服务器。

### 在线部署选项
- **Vercel**: 连接GitHub仓库，自动部署
- **Netlify**: 拖拽 `dist` 文件夹到Netlify
- **GitHub Pages**: 使用GitHub Actions自动部署
- **Firebase Hosting**: 使用Firebase CLI部署

### 性能优化建议
- 启用gzip压缩
- 使用CDN加速Three.js库
- 启用浏览器缓存
- 考虑使用Web Workers处理复杂计算

## 🎮 游戏特色

### 已实现功能 ✅
- ✅ 3D六边形容器旋转
- ✅ 物理引擎（重力、摩擦力、碰撞）
- ✅ 粒子效果系统
- ✅ 音效系统（Web Audio API）
- ✅ 鼠标交互控制
- ✅ 响应式设计
- ✅ 自动化测试

### 可扩展功能 🔮
- 🔮 多个小球同时弹跳
- 🔮 不同材质的小球
- 🔮 障碍物和道具
- 🔮 分数系统
- 🔮 关卡设计
- 🔮 VR/AR支持

## �📄 许可证

MIT License
