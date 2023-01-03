import VfbfStreamer from './VfbfStreamer.js';

const demoVfbfStreamer = () => {
  document.getElementById('sourceName').innerHTML =
    'Video Title: flock-of-seagulls';
  document.getElementById('credit').innerHTML =
    'Credit+thanks to video stock: https://mixkit.co/ ';

  // value={this.state.currentTime}
  // onChange={this.updateVideoDuration}
  const range = document.getElementById('range-input');
  range.onchange = function (e) {
    range.value = e.target.value;
    vfbf.setCurrentTime(e.target.value);
  };
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const context = canvas.getContext('2d');
  canvas.onclick = () => {
    onclick();
  };

  var button = document.getElementById('playUrl');
  button.innerHTML = 'Play';
  button.onclick = function () {
    onclick();
  };

  const onclick = () => {
    const url =
      'https://assets.mixkit.co/videos/download/mixkit-flock-of-seagulls-in-the-sky-17978-medium.mp4';
    vfbf.playVideo(url);
    if (playUrl.innerHTML === 'Play') {
      playUrl.innerHTML = 'Stop';
    } else {
      playUrl.innerHTML = 'Play';
    }
    return false;
  };

  var lastLoop = 0;
  const findFps = () => {
    var thisLoop = new Date();
    const fps = (1000 / (thisLoop - lastLoop))
      .toFixed(2)
      .toString()
      .padStart(5, '0');

    lastLoop = thisLoop;
    return fps;
  };

  const VideoEnded = () => {
    playUrl.innerHTML = 'Play';
  };

  const cbk = (frame, currentTime, duration) => {
    context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    context.beginPath();
    const fps = findFps();
    vfbf.getAnimationControl()();

    const text1 = 'fps: ' + fps;
    const text2 = 'time: ' + currentTime.toFixed(1) + '/' + duration.toFixed(1);
    context.font = '30px Georgia';
    context.fillText(text1, 40, 40);
    context.fillText(text2, 40, 140);
    range.value = currentTime;
    range.max = duration;
  };
  const vfbf = new VfbfStreamer(cbk, canvas.height, canvas.height, VideoEnded);
};
demoVfbfStreamer();
