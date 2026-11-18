"use client";
import { useEffect, useState } from "react";
import { Button, Select, Space } from "antd";

export function usePlayback(finished: boolean, step: () => void) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(850);
  useEffect(() => {
    if (!playing || finished) return;
    const timer = window.setInterval(step, speed);
    return () => window.clearInterval(timer);
  }, [playing, finished, step, speed]);
  return { playing: playing && !finished, setPlaying, speed, setSpeed };
}

export function PlaybackControls({ playback, finished, started, step, reset }: {
  playback: ReturnType<typeof usePlayback>;
  finished: boolean;
  started: boolean;
  step: () => void;
  reset: () => void;
}) {
  return <Space wrap>
    <Button htmlType="button" type="primary" disabled={finished}
      onClick={() => playback.setPlaying(!playback.playing)}>
      {playback.playing ? "暂停" : started ? "继续" : "播放"}
    </Button>
    <Button htmlType="button" disabled={finished || playback.playing} onClick={step}>单步</Button>
    <Button htmlType="button" onClick={reset}>重置</Button>
    <Select aria-label="播放速度" value={playback.speed} onChange={playback.setSpeed} options={[
      { value: 1500, label: "慢速" }, { value: 850, label: "正常速度" }, { value: 350, label: "快速" },
    ]} />
  </Space>;
}
