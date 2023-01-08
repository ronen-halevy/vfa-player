import { VfbfStreamer } from './VfbfStreamer.js';

const demoVfbfStreamer = () => {
  // value={this.state.currentTime}
  // onChange={this.updateVideoDuration}
  const range = document.getElementById('range-input');
  range.onchange = function (e) {
    range.value = e.target.value;
    vfbf.setCurrentTime(e.target.value);
  };
  var isVideoPlaying = false;
  const onClickPlay = () => {
    console.log(selectedUrl);
    isVideoPlaying =
      selectedType == 'video'
        ? vfbf.playVideo(selectedUrl)
        : vfbf.playImage(selectedUrl);

    if (isVideoPlaying) {
      playUrl.innerHTML = 'Stop';
    } else {
      playUrl.innerHTML = 'Play';
    }
    return false;
  };

  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  canvas.addEventListener('click', onClickPlay);
  const context = canvas.getContext('2d');
  context.fillStyle = 'grey';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const vidUrl =
    'https://assets.mixkit.co/videos/download/mixkit-flock-of-seagulls-in-the-sky-17978-medium.mp4';
  const imgUrl =
    'https://www.shutterstock.com/shutterstock/photos/1262270857/display_1500/stock-photo-curvy-windy-road-in-snow-covered-forest-top-down-aerial-view-1262270857.jpg';
  var fileUrl = '';
  var fileUrlType = '';

  var selectedUrl = '';
  var selectedType = '';

  // load and play video by url
  var button = document.getElementById('playUrl');
  button.innerHTML = 'Play';
  button.onclick = onClickPlay;
  const sources = [
    { id: 'videoUrl', value: vidUrl, class: 'video' },
    { id: 'imageUrl', value: imgUrl, class: 'image' },
    { id: 'localFile', value: '', class: '' },
  ];
  selectedUrl = vidUrl;
  selectedType = 'video';

  const onchangeRadio = (event) => {
    console.log(event.target.class);
    console.log(event.target.value);
    console.log(event.target);
    const selectedSourceId = event.target.id;

    selectedUrl = event.target.value;
    console.log('selectedUrl', selectedUrl);
    selectedType = selectedUrl.match(/\.(jpg|jpeg|png|gif)$/i)
      ? 'image'
      : selectedUrl.match(/\.(mp4)$/i)
      ? 'video'
      : 'fileSrc';
    if (selectedType == 'fileSrc') {
      console.log('fileUrlType', fileUrlType);
      selectedUrl = fileUrl;
      selectedType = fileUrlType;
      buttonFile.style.visibility = 'visible';
    } else {
      buttonFile.style.visibility = 'hidden';
    }
    document.getElementById('selectedUrl').innerHTML =
      'Selected url: ' + selectedUrl;
  };

  sources.map((source, index) => {
    const radioButton = document.getElementById(source.id);
    radioButton.value = source.value;
    radioButton.onchange = onchangeRadio;
  });

  // load and play image / video file
  var buttonFile = document.getElementById('inputFile');
  buttonFile.onchange = function (event) {
    const file = event.target.files[0];
    // extract url, required by vfbfStreamer as an input:
    var URL = window.URL || window.webkitURL;
    fileUrl = URL.createObjectURL(file);
    // save url and type to feed player:
    selectedUrl = fileUrl;
    // determine type, since streamer has a dedicated method for still images:
    fileUrlType = file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'video';
    selectedType = fileUrlType;
    // display:
    document.getElementById('selectedUrl').innerHTML =
      'Selected url: ' + selectedUrl;
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

  const streamerCallback = (frame, currentTime, duration) => {
    // if video
    if (duration) {
      canvas.width = frame.videoWidth;
      canvas.height = frame.videoHeight;
      var fps = findFps();
    } else {
      canvas.width = frame.width;
      canvas.height = frame.height;
      var fps = 0;
    }

    context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    context.beginPath();
    vfbf.getAnimationControl()();

    const text1 =
      'time: ' +
      currentTime.toFixed(1) +
      '/' +
      duration.toFixed(1) +
      ' fps: ' +
      fps;
    context.font = '30px Georgia';
    context.fillStyle = '#00ff00';
    context.fillText(text1, 40, 40);
    range.value = currentTime;
    range.max = duration;
  };
  document.getElementById('selectedUrl').innerHTML =
    'Selected url: ' + selectedUrl;

  const vfbf = new VfbfStreamer(streamerCallback, VideoEnded);
};
demoVfbfStreamer();
