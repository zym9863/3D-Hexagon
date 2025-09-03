/**
 * 音效管理器
 * 使用Web Audio API生成简单的音效
 */
export class AudioManager {
  private audioContext: AudioContext | null = null;
  private isEnabled = true;

  constructor() {
    this.initAudioContext();
  }

  /**
   * 初始化音频上下文
   */
  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.isEnabled = false;
    }
  }

  /**
   * 播放碰撞音效
   */
  public playCollisionSound(intensity: number = 1): void {
    if (!this.isEnabled || !this.audioContext) return;

    // 确保音频上下文已启动
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // 连接音频节点
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 设置音效参数
    const frequency = 200 + intensity * 300; // 根据强度调整频率
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      frequency * 0.3, 
      this.audioContext.currentTime + 0.1
    );

    // 设置音量包络
    const volume = Math.min(intensity * 0.3, 0.3);
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

    // 播放音效
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  /**
   * 播放弹跳音效
   */
  public playBounceSound(intensity: number = 1): void {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // 弹跳音效使用不同的频率模式
    const baseFreq = 150 + intensity * 200;
    oscillator.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(
      baseFreq * 1.5, 
      this.audioContext.currentTime + 0.05
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      baseFreq * 0.7, 
      this.audioContext.currentTime + 0.12
    );

    const volume = Math.min(intensity * 0.2, 0.2);
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.12);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.12);
  }

  /**
   * 启用/禁用音效
   */
  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  /**
   * 获取音效状态
   */
  public getEnabled(): boolean {
    return this.isEnabled;
  }
}
