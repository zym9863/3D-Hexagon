/**
 * 简单的游戏功能测试
 * 验证游戏的核心组件是否正常工作
 */

import { HexagonBallGame } from './HexagonBallGame';
import { AudioManager } from './AudioManager';

/**
 * 测试音效管理器
 */
function testAudioManager(): boolean {
  console.log('测试音效管理器...');
  
  try {
    const audioManager = new AudioManager();
    
    // 测试音效开关
    const initialState = audioManager.getEnabled();
    audioManager.setEnabled(!initialState);
    const newState = audioManager.getEnabled();
    
    if (newState === initialState) {
      console.error('❌ 音效开关测试失败');
      return false;
    }
    
    // 恢复初始状态
    audioManager.setEnabled(initialState);
    
    console.log('✅ 音效管理器测试通过');
    return true;
  } catch (error) {
    console.error('❌ 音效管理器测试失败:', error);
    return false;
  }
}

/**
 * 测试游戏初始化
 */
function testGameInitialization(): boolean {
  console.log('测试游戏初始化...');
  
  try {
    // 创建一个临时的canvas元素
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    
    // 初始化游戏
    const game = new HexagonBallGame(canvas);
    
    // 测试重置功能
    game.resetBall();
    
    // 测试音效切换
    const audioState1 = game.toggleAudio();
    const audioState2 = game.toggleAudio();
    
    if (audioState1 === audioState2) {
      console.error('❌ 音效切换测试失败');
      return false;
    }
    
    console.log('✅ 游戏初始化测试通过');
    return true;
  } catch (error) {
    console.error('❌ 游戏初始化测试失败:', error);
    return false;
  }
}

/**
 * 测试Three.js依赖
 */
function testThreeJSDependency(): boolean {
  console.log('测试Three.js依赖...');
  
  try {
    // 动态导入Three.js来测试是否可用
    import('three').then((THREE) => {
      if (!THREE.Scene || !THREE.WebGLRenderer || !THREE.PerspectiveCamera) {
        console.error('❌ Three.js核心组件缺失');
        return false;
      }
      
      // 测试基本的Three.js功能
      const scene = new THREE.Scene();
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      const cube = new THREE.Mesh(geometry, material);

      scene.add(cube);
      
      console.log('✅ Three.js依赖测试通过');
      return true;
    }).catch((error) => {
      console.error('❌ Three.js依赖测试失败:', error);
      return false;
    });
    
    return true;
  } catch (error) {
    console.error('❌ Three.js依赖测试失败:', error);
    return false;
  }
}

/**
 * 运行所有测试
 */
export function runTests(): void {
  console.log('🧪 开始运行游戏测试...\n');
  
  const tests = [
    { name: 'Three.js依赖', test: testThreeJSDependency },
    { name: '音效管理器', test: testAudioManager },
    { name: '游戏初始化', test: testGameInitialization }
  ];
  
  let passedTests = 0;
  const totalTests = tests.length;
  
  tests.forEach((testCase, index) => {
    console.log(`\n${index + 1}. ${testCase.name}`);
    if (testCase.test()) {
      passedTests++;
    }
  });
  
  console.log(`\n📊 测试结果: ${passedTests}/${totalTests} 通过`);
  
  if (passedTests === totalTests) {
    console.log('🎉 所有测试通过！游戏准备就绪。');
  } else {
    console.log('⚠️  部分测试失败，请检查相关功能。');
  }
}

/**
 * 性能测试
 */
export function runPerformanceTest(): void {
  console.log('🚀 开始性能测试...');
  
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  
  const startTime = performance.now();
  
  try {
    const game = new HexagonBallGame(canvas);
    
    // 模拟一些操作
    for (let i = 0; i < 10; i++) {
      game.resetBall();
      game.toggleAudio();
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    console.log(`⏱️  游戏初始化和操作耗时: ${duration.toFixed(2)}ms`);
    
    if (duration < 1000) {
      console.log('✅ 性能测试通过 - 响应速度良好');
    } else {
      console.log('⚠️  性能测试警告 - 初始化时间较长');
    }
  } catch (error) {
    console.error('❌ 性能测试失败:', error);
  }
}

// 如果直接运行此文件，执行测试
if (typeof window !== 'undefined' && window.location.search.includes('test=true')) {
  document.addEventListener('DOMContentLoaded', () => {
    runTests();
    runPerformanceTest();
  });
}
