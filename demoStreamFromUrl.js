import VfbfStreamer from './VfbfStreamer.js';

var playUrl = document.getElementById('mylink4');
playUrl.innerHTML = 'Play';

const pp = () => {
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');

  playUrl.onclick = function () {
    vfbf.playVideo(dataUrl);
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
    console.log('on click!!!!');
    playUrl.innerHTML = 'Play';
  };
  const dataUrl =
    'https://assets.mixkit.co/videos/preview/mixkit-lovers-walking-through-a-lavender-field-4530-large.mp4';
  const cbk = (frame, currentTime, duration) => {
    const size = 150;
    context.drawImage(frame, 0, 0, size, size);
    const alpha = Math.random();
    context.globalAlpha = alpha;
    context.beginPath();
    const loc = 5 + Math.floor(currentTime) * 5;
    context.rect(loc, loc, 40, 40);
    context.stroke();
    const fps = findFps();
    document.getElementById('demo').innerHTML =
      'fps: ' +
      fps +
      ' time:' +
      currentTime.toFixed(1) +
      '/' +
      duration.toFixed(1);
    vfbf.getAnimationControl()();
  };
  const vfbf = new VfbfStreamer(cbk, 416, 416, VideoEnded);
};
pp();
