import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube"; // <-- Import YouTube plugin

const VideoJS = ({ src, autoplay = false, controls = true, width, height }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      // Check if URL is YouTube
      const isYouTube = src.includes("youtube.com") || src.includes("youtu.be");

      playerRef.current = videojs(videoRef.current, {
        autoplay,
        controls,
        width,
        height,
        techOrder: isYouTube ? ["youtube"] : ["html5"],
        sources: [
          isYouTube
            ? {
                src,
                type: "youtube",
              }
            : {
                src,
                type: "video/mp4",
              },
        ],
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
      }
    };
  }, [src]);

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="video-js vjs-big-play-centered" />
    </div>
  );
};

export default VideoJS;
