export default function TransparentImg({ src, alt, className = "" }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain mix-blend-multiply"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300";
        }}
      />
    </div>
  );
}
