import type { Playground } from "@/components/algorithm-demo/javascript-demo";

function createDiningExample(orderedOnly: boolean): Playground {
  return {
    html: `<h2>${orderedOnly ? "解法：按编号取筷" : "哲学家进餐"}</h2>
<div class="controls">
  <label>人数 <select id="count"><option>3</option><option>4</option><option selected>5</option><option>6</option><option>7</option></select></label>
  ${orderedOnly ? "" : `<label>策略 <select id="strategy"><option value="left">先拿左筷</option><option value="ordered">按编号取筷</option></select></label>`}
  <label>速度 <select id="speed"><option value="1200">慢速</option><option value="700" selected>正常</option><option value="300">快速</option></select></label>
</div>
<div id="table" aria-label="圆桌和共享筷子"></div>
<ul class="legend" aria-label="状态图例">
  <li class="ready">待取筷</li><li class="waiting">等待</li><li class="eating">进餐</li><li class="done">吃完</li>
</ul>
${orderedOnly ? `<p id="order" aria-label="每个人的取筷顺序"></p>` : ""}
<p id="status" aria-live="polite"></p>
<div class="controls"><button id="step">单步</button><button id="play">播放</button><button id="reset">重置</button></div>`,
    css: `h2 { margin: 0 0 10px; }
.controls { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
button, select { padding: 5px; border: 1px solid #8fa69a; border-radius: 6px; background: white; color: #172a20; }
#table { position: relative; width: min(100%, 350px); aspect-ratio: 1; margin: 12px auto; }
#table::before { content: ""; position: absolute; inset: 21%; border-radius: 50%; background: #dbeae1; border: 2px solid #a4bcad; box-shadow: inset 0 0 0 5px #eff6f1; }
.seat, .fork { position: absolute; transform: translate(-50%, -50%); display: grid; justify-items: center; font-size: 11px; text-align: center; }
.seat { width: 50px; line-height: 1.35; z-index: 1; }
.person { display: grid; width: clamp(30px, 11vw, 44px); aspect-ratio: 1; place-items: center; border-radius: 50%; background: var(--fill); color: var(--ink); border: 2px solid currentColor; }
.person svg { width: 64%; height: 64%; }
.seat span { white-space: nowrap; background: #f4f8f5; color: var(--ink); padding-inline: 3px; border-radius: 3px; }
.ready { --fill: #e8eff8; --ink: #305b82; }
.waiting { --fill: #fff0c9; --ink: #8a5000; }
.eating { --fill: #cdf5dc; --ink: #14663f; }
.done { --fill: #e9e6f5; --ink: #5d477d; }
.fork { color: #546961; width: 18px; line-height: 1; transition: left .22s ease, top .22s ease; z-index: 2; }
.fork svg { width: 16px; height: 23px; }
.fork.held { color: #6934a4; }
.fork span { background: #f4f8f5; border-radius: 3px; padding-inline: 2px; }
.legend { display: flex; flex-wrap: wrap; gap: 6px; list-style: none; padding: 0; margin: 4px 0; }
.legend li { background: var(--fill); color: var(--ink); border-radius: 12px; padding: 3px 8px; font-size: 11px; }
@media (prefers-reduced-motion: reduce) { .fork { transition: none; } }
#order { font-size: 12px; line-height: 1.7; margin-block: 8px; }
#status { background: white; border-radius: 8px; padding: 8px; min-height: 2.5em; margin-block: 4px 8px; }`,
    javascript: `const $ = id => document.getElementById(id);
let forks, phases, cursor, steps, timer, ended;

function reset() {
  pause();
  const count = Number($("count").value);
  forks = Array(count).fill(-1);
  phases = Array(count).fill(0);
  cursor = steps = 0;
  ended = false;
  if ($("order")) {
    const orders = phases.map((_, person) => {
      const [first, second] = pair(person);
      return (person + 1) + " 号 " + (first + 1) + " → " + (second + 1);
    });
    $("order").textContent = orders.slice(0, -1).join(" · ") + " · 最后一位 " + orders[orders.length - 1];
  }
  render("每人要同时拿到左右各一根筷子。");
}

function pair(person) {
  const right = (person + 1) % forks.length;
  return ${orderedOnly ? "true" : '$("strategy").value === "ordered"'}
    ? [Math.min(person, right), Math.max(person, right)]
    : [person, right];
}

function step() {
  if (ended) return;
  for (let offset = 0; offset < forks.length; offset++) {
    const person = (cursor + offset) % forks.length;
    const phase = phases[person];
    if (phase === 3) continue;
    const [first, second] = pair(person);
    let message;
    if (phase === 2) {
      forks[first] = forks[second] = -1;
      message = (person + 1) + " 号吃完，放回两根筷子。";
    } else {
      const fork = phase === 0 ? first : second;
      if (forks[fork] !== -1) continue;
      forks[fork] = person;
      message = (person + 1) + " 号拿起筷子 " + (fork + 1) + (phase === 1 ? "，开始进餐。" : "。");
    }
    phases[person]++;
    cursor = (person + 1) % forks.length;
    steps++;
    if (phases.every(value => value === 3)) {
      ended = true;
      pause();
      message += " 所有人都已吃完。";
    }
    render(message);
    return;
  }
  ended = true;
  pause();
  render("死锁：剩下的人都在等待，没人能放回手里的筷子。");
}

const labels = ["待取筷", "等第二根", "进餐", "吃完"];
const colors = ["ready", "waiting", "eating", "done"];
const personIcon = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="6" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2z"/></svg>';
const forkIcon = '<svg aria-hidden="true" viewBox="0 0 16 24" fill="currentColor"><path d="m12 2 3 2L3 23l-2-1z"/></svg>';
let seats = [], forkBadges = [];

function createBadge() {
  const node = document.createElement("div");
  $("table").append(node);
  return node;
}

function place(node, index, radius) {
  const angle = index * 2 * Math.PI / forks.length - Math.PI / 2;
  node.style.left = (50 + radius * Math.cos(angle)) + "%";
  node.style.top = (50 + radius * Math.sin(angle)) + "%";
}

function render(message) {
  if (seats.length !== forks.length) {
    $("table").replaceChildren();
    seats = forks.map(createBadge);
    forkBadges = forks.map(createBadge);
  }
  phases.forEach((phase, index) => {
    const seat = seats[index];
    seat.className = "seat " + colors[phase];
    seat.innerHTML = '<div class="person">' + personIcon + '</div><span>' + (index + 1) + " 号 · " + labels[phase] + '</span>';
    place(seat, index, 39);
  });
  forks.forEach((owner, index) => {
    const fork = forkBadges[index];
    fork.className = owner < 0 ? "fork" : "fork held";
    fork.innerHTML = forkIcon + '<span aria-hidden="true">' + (index + 1) + '</span>';
    fork.setAttribute("role", "img");
    fork.setAttribute("aria-label", "筷子 " + (index + 1) + " · " + (owner < 0 ? "空闲" : (owner + 1) + " 号持有"));
    fork.title = fork.getAttribute("aria-label");
    place(fork, owner < 0 ? index - 0.5 : owner + (index === owner ? -0.23 : 0.23), owner < 0 ? 21 : 31);
  });
  $("status").textContent = "第 " + steps + " 步 · " + message;
  $("step").disabled = ended || Boolean(timer);
  $("play").disabled = ended;
  $("play").textContent = timer ? "暂停" : steps ? "继续" : "播放";
}

function pause() {
  clearInterval(timer);
  timer = undefined;
}

function togglePlayback() {
  if (timer) pause();
  else timer = setInterval(step, Number($("speed").value));
  $("play").textContent = timer ? "暂停" : steps ? "继续" : "播放";
  $("step").disabled = Boolean(timer);
}

$("step").onclick = step;
$("play").onclick = togglePlayback;
$("reset").onclick = reset;
$("count").onchange = reset;
if ($("strategy")) $("strategy").onchange = reset;
$("speed").onchange = () => {
  if (timer) {
    pause();
    togglePlayback();
  }
};
reset();`,
  };
}

export const diningExample = createDiningExample(false);
export const diningSolutionExample = createDiningExample(true);
