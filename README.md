# vfbf-streamer

A utility for frame-by-frame video processing applications

The vfbf-streamer receives a video url, opens the pointed source video file and streams it frame-by-frame. This utility can easily be integrated with video processing apps which process the video frame by frame, e.g. object detection apps.

The repo contains demo files which demonstrate an example implementation of the vfbf-stramer.
Click for the live demo

This demo demonstrates an implemantation of the vfbf streamer.

APIs:

<p>VfpfStreamer API:</p>
<b>Constructor:</b>
VfbfStreamer(streamerCallback, VideoEnded)
Where: 
streamerCallback(frame, currentTime, duration) is the callback for feeding back video frames, with indications of current frame time and duration. In case of a stills image, currentTime and duration are 0. 
VideoEnded() is called after sending the last frame or after streamerCallback is invoked, in case of an image.

playVideo(sourceUrl) - This method trigers sending a callback with next video frame.
playImage(sourceUrl) - This method triggers sending a calback with loaded image blob
animationControl - This method triggers video frames animation. Should be invoked in before calling playVideo.
setCurrentTime(currentTime) - This method should be invoded when time is skipped externally. Normally it is invoked by range component's callback.
