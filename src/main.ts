import './style.css'
import { HexagonBallGame } from './HexagonBallGame'
import { runTests, runPerformanceTest } from './test'

/**
 * 初始化3D六边形弹球游戏
 */
function initGame(): void {
  const canvas = document.querySelector<HTMLCanvasElement>('#game-canvas')!;
  const resetBtn = document.querySelector<HTMLButtonElement>('#reset-btn')!;
  const audioBtn = document.querySelector<HTMLButtonElement>('#audio-btn')!;

  // 创建游戏实例
  const game = new HexagonBallGame(canvas);

  // 绑定重置按钮事件
  resetBtn.addEventListener('click', () => {
    game.resetBall();
  });

  // 绑定音效按钮事件
  audioBtn.addEventListener('click', () => {
    const isEnabled = game.toggleAudio();
    audioBtn.textContent = isEnabled ? '🔊 音效开启' : '🔇 音效关闭';
    audioBtn.classList.toggle('disabled', !isEnabled);
  });

  console.log('3D六边形弹球游戏已启动！');

  // 开发模式下运行测试
  if (import.meta.env.DEV) {
    console.log('\n🔧 开发模式 - 运行测试');
    setTimeout(() => {
      runTests();
      runPerformanceTest();
    }, 1000);
  }
}

// 等待DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', initGame);
