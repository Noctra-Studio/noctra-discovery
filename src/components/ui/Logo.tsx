interface LogoProps {
  size?: "sm" | "md" | "lg";
  color?: "white" | "black";
  className?: string;
}

const sizeMap = {
  sm: 24,
  md: 48,
  lg: 96,
};

export default function Logo({
  size = "md",
  color = "white",
  className,
}: LogoProps) {
  const px = sizeMap[size];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 90 90"
      fill={color === "white" ? "#F5F5F0" : "#080808"}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <polygon points="8,82 8,18 52,82" />
      <rect x="60" y="30" width="10" height="52" />
      <rect x="76" y="30" width="10" height="52" />
    </svg>
  );
}
