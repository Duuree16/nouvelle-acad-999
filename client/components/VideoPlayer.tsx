interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export const VideoPlayer = ({ src, title, className = "" }: VideoPlayerProps) => {
  return (
    <div className={`aspect-video bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        width="100%"
        height="100%"
        controls
        className="w-full h-full"
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
