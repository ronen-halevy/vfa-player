import VfbfStreamer from './VfbfStreamer.js';
var myLink = document.getElementById('mylink');
myLink.onclick = function () {
  console.log('!!!!!!!');
  var script = document.createElement('script');
  script.type = 'text/javascript';
  //   script.src = 'Public/Scripts/filename.js.';
  //   document.getElementsByTagName('head')[0].appendChild(script);
  const tt = new VfbfStreamer();
  console.log(tt);
  return false;
};

// var myLink2 = document.getElementById('mylink');
// myLink2.onclick = function () {
//   console.log('!!!!??????!!!');

//   return false;
// };

var myLink2 = document.getElementById('mylink2');
myLink2.onclick = function () {
  // playImage = () => {
  const dataUrl =
    'https://www.shutterstock.com/image-vector/neon-rounded-square-frame-shining-600w-1907166643.jpg';
  var imageObject = new window.Image();
  //
  const fetchImage = async () => {
    const res = await fetch(dataUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    imageObject.src = imageObjectURL;
    imageObject.addEventListener('load', async () => {
      console.log('done');
      const canvas = document.getElementById('canvas');
      const context = canvas.getContext('2d');
      context.drawImage(imageObject, 0, 0, 150, 150);

      // this.playCallback(imageObject, null, null);
    });
  };
  console.log('!!!???????!!!!');
  fetchImage();

  return false;
};

var myLink3 = document.getElementById('mylink3');
myLink3.onclick = function () {
  const cbk = (frame) => {
    this.context.drawImage(frame, 0, 0, 150, 150);
    // console.log(frame);
    this.vfbf.getAnimationControl()();
  };

  const canvas = document.getElementById('canvas');
  this.context = canvas.getContext('2d');
  // playImage = () => {
  const dataUrl =
    'https://assets.mixkit.co/videos/preview/mixkit-lovers-walking-through-a-lavender-field-4530-large.mp4';
  this.vfbf = new VfbfStreamer(cbk, 416, 416);

  const anim = this.vfbf.getAnimationControl();
  this.vfbf.playVideo(dataUrl);

  // //   var imageObject = new window.Image();
  //   //
  //   const fetchImage = async () => {
  //     const res = await fetch(dataUrl);
  //     const imageBlob = await res.blob();
  //     const imageObjectURL = URL.createObjectURL(imageBlob);
  //     imageObject.src = imageObjectURL;
  //     imageObject.addEventListener('load', async () => {
  //       console.log('done');
  //       const canvas = document.getElementById('canvas');
  //       const context = canvas.getContext('2d');
  //       context.drawImage(imageObject, 0, 0, 150, 150);

  //       // this.playCallback(imageObject, null, null);
  //     });
  //   };
  //   console.log('!!!???????!!!!');
  //   fetchImage();

  return false;
};
