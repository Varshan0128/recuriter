type BrandLogoProps = {
  className?: string;
  size?: number;
};

export default function BrandLogo({ className = "", size = 24 }: BrandLogoProps) {
  return (
    <img
      src="/brand-logo.png"
      alt="HiredAI logo"
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

export { BrandLogo };