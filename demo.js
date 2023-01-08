import { VfbfStreamer } from './VfbfStreamer.js';

const demoVfbfStreamer = () => {
  // callback of html components:

  // range bar callabck:
  const range = document.getElementById('range-input');
  range.onchange = function (e) {
    range.value = e.target.value;
    vfbf.setCurrentTime(e.target.value);
  };
  // play-stop callabck - common to play button and clickable canvas:
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

  // inputFile button callback:
  const onChangeInputFile = (event) => {
    const file = event.target.files[0];
    // extract url, required by vfbfStreamer as an input:
    var URL = window.URL || window.webkitURL;
    fileUrl = URL.createObjectURL(file);
    // save url and type to feed player:
    selectedUrl = fileUrl;
    // determine type, since streamer has a dedicated method for still images:
    fileUrlType = file.name.match(/\.(jpg|jpeg|png|gif)$/i) ? 'image' : 'video';
    selectedType = fileUrlType;
    // annotate document with selected url (added wherever url changes)
    document.getElementById('selectedUrl').innerHTML =
      'Selected url: ' + selectedUrl;
  };

  //  input source selection radio buttons  callback:
  const vidUrl =
    'https://assets.mixkit.co/videos/download/mixkit-flock-of-seagulls-in-the-sky-17978-medium.mp4';
  const imgUrl =
    'https://www.shutterstock.com/shutterstock/photos/1262270857/display_1500/stock-photo-curvy-windy-road-in-snow-covered-forest-top-down-aerial-view-1262270857.jpg';
  var fileUrl = '';
  var fileUrlType = '';

  var selectedUrl = vidUrl;
  // annotate document with selected url (added wherever url changes)
  document.getElementById('selectedUrl').innerHTML =
    'Selected url: ' + selectedUrl;
  var selectedType = 'video';

  const onchangeRadio = (event) => {
    selectedUrl = event.target.value;
    selectedType = selectedUrl.match(/\.(jpg|jpeg|png|gif)$/i)
      ? 'image'
      : selectedUrl.match(/\.(mp4)$/i)
      ? 'video'
      : 'fileSrc';
    if (selectedType == 'fileSrc') {
      console.log('fileUrlType', fileUrlType);
      selectedUrl = fileUrl;
      selectedType = fileUrlType;
      inputFile.style.visibility = 'visible';
    } else {
      inputFile.style.visibility = 'hidden';
    }
    // // annotate document with selected url (added wherever url changes)
    document.getElementById('selectedUrl').innerHTML =
      'Selected url: ' + selectedUrl;
  };

  // onchangeAlg by radio buttons:
  var selectedAlg = 'original';
  const onchangeAlg = (event) => {
    selectedAlg = event.target.value;
  };

  // html components setup:

  // canvas setup
  const canvas = document.getElementById('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.addEventListener('click', onClickPlay);
  const context = canvas.getContext('2d'); // tbd: attribute slows the none-algorithm pass fps: , { willReadFrequently: true });
  context.fillStyle = 'grey';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // canvas setup

  //  play-stop button
  var button = document.getElementById('playUrl');
  button.innerHTML = 'Play';
  button.onclick = onClickPlay;

  // set radio buttons for input source selection

  const inputSources = [
    { id: 'videoUrl', value: vidUrl },
    { id: 'imageUrl', value: imgUrl },
    { id: 'localFile', value: '' },
  ];
  inputSources.map((source, index) => {
    const radioButton = document.getElementById(source.id);
    radioButton.value = source.value;
    radioButton.onchange = onchangeRadio;
  });

  // inputFile  for image / video file selection:
  var inputFile = document.getElementById('inputFile');
  inputFile.onchange = onChangeInputFile;

  // set radio buttons for alg  selection
  const algorithms = [
    { id: 'original', value: 'original' },
    { id: 'bw', value: 'bw' },
    { id: 'threshold', value: 'threshold' },
    { id: 'canny', value: 'canny' },
  ];
  algorithms.map((algorithm, index) => {
    const radioButton = document.getElementById(algorithm.id);
    radioButton.value = algorithm.value;
    radioButton.onchange = onchangeAlg;
  });

  // Utilities:
  // fps calc:
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

  // VfbfStreamer callbacksL
  // video ended callback:
  const VideoEnded = () => {
    playUrl.innerHTML = 'Play';
  };

  // Frame by frame callback (frame processing callback):
  const streamerCallback = (frame, currentTime, duration) => {
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
    if (selectedAlg != 'original') {
      try {
        // opencv demo process:
        let src = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC4);
        let dst = new cv.Mat(canvas.height, canvas.width, cv.CV_8UC1);
        src.data.set(
          context.getImageData(0, 0, canvas.width, canvas.height).data
        );
        if (selectedAlg == 'bw') {
          cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
        } else if (selectedAlg == 'threshold') {
          cv.threshold(src, dst, 177, 200, cv.THRESH_BINARY);
        } else if (selectedAlg == 'canny') {
          cv.Canny(src, dst, 50, 100, 3, false);
        }

        cv.imshow('canvas', dst); // canvasOutput is the id of another <canvas>;
        // must clean:
        src.delete();
        dst.delete();
      } catch (error) {
        console.log('error', error);
      }
    }

    context.beginPath();
    // trigger animation control:
    vfbf.animationControl();

    // annotate frame with fps, curenttime and duration:
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

  const vfbf = new VfbfStreamer(streamerCallback, VideoEnded);
};
demoVfbfStreamer();
