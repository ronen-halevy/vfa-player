import { VfbfStreamer } from './VfbfStreamer.js';

const demoVfbfStreamer = () => {
	// callbacks of html elements:

	// range bar callabck:
	$('#customRange3').change(function (e) {
		$('#playUrl').val(e.target.value);
		vfbf.setCurrentTime(e.target.value);
	});

	var isVideoPlaying = false;
	const onClickPlay = () => {
		isVideoPlaying = vfbf.playVideo(selectedUrl);
		if (isVideoPlaying) {
			$('#playUrl').text('Stop');
			$('#runningStatus').text('running');
		} else {
			$('#playUrl').text('Play');
			$('#runningStatus').text('');
		}
	};

	// inputFile button callback:
	const onChangeInputFile = (event) => {
		const file = event.target.files[0];
		// extract url, required by vfbfStreamer as an input:
		var URL = window.URL || window.webkitURL;
		fileUrl = URL.createObjectURL(file);
		// save url and type to feed player:
		selectedUrl = fileUrl;
		// annotate document with selected url (added wherever url changes)
		$('#selectedUrl').text('Selected url: ' + selectedUrl);
	};

	//  input source selection radio buttons  callback:
	const vidUrl =
		'https://assets.mixkit.co/videos/download/mixkit-flock-of-seagulls-in-the-sky-17978-medium.mp4';
	var fileUrl = '';

	var selectedUrl = vidUrl;
	// annotate document with selected url (added wherever url changes)
	$('#selectedUrl').text('Selected url: ' + selectedUrl);

	const onchangeSource = (event) => {
		const source = event.target.value;
		if (source == 'file') {
			selectedUrl = fileUrl;
			inputFile.style.visibility = 'visible';
		} else {
			selectedUrl = vidUrl;
			inputFile.style.visibility = 'hidden';
		}
		// // annotate document with selected url (added wherever url changes)
		$('#selectedUrl').text('Selected url: ' + selectedUrl);
	};

	// onchangeAlg by radio buttons:
	var selectedAlg = 'original';
	const onchangeAlg = (event) => {
		selectedAlg = event.target.value;
	};

	// html components setup:

	// canvas setup
	$('#canvas').on('click', onClickPlay);
	const context = canvas.getContext('2d'); // tbd: attribute slows the none-algorithm pass fps: , { willReadFrequently: true });
	context.fillStyle = 'grey';
	// dims of canvas on start
	context.fillRect(0, 0, 100, 100);

	// canvas setup

	$('#playUrl').text('Play');
	$('#playUrl').click(onClickPlay);

	//  radio buttons for input source selection
	const inputSources = [
		{ id: 'url', value: 'url' },
		{ id: 'file', value: 'file' },
	];
	inputSources.map((source, index) => {
		$('#' + source.id).val(source.value);
		$('#' + source.id).change(onchangeSource);
	});

	// inputFile  for image / video file selection:
	$('#inputFile').change(onChangeInputFile);

	// set radio buttons for alg  selection
	const algorithms = [
		{ id: 'original', value: 'original' },
		{ id: 'bw', value: 'bw' },
		{ id: 'threshold', value: 'threshold' },
		{ id: 'canny', value: 'canny' },
	];
	algorithms.map((algorithm, index) => {
		$('#' + algorithm.id).val(algorithm.value);
		$('#' + algorithm.id).change(onchangeAlg);
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

	// VfbfStreamer callbacks:
	// video ended callback:
	const VideoEnded = () => {
		// change button text
		$('#playUrl').text('Play');
		// clear running message:
		$('#runningStatus').text('');
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
		$('#customRange3').val(currentTime);
		$('#customRange3').prop('max', duration);
	};
	const vfbf = new VfbfStreamer(streamerCallback, VideoEnded);
};
demoVfbfStreamer();
