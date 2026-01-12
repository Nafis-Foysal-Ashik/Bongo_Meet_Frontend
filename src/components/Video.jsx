function Video({ stream }) {
  return (
    <video
      autoPlay
      playsInline
      ref={video => {
        if (video) video.srcObject = stream;
      }}
    />
  );
}

export default Video;
