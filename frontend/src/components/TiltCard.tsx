import type { ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  maxTilt?: number;
};

export default function TiltCard({
  children,
  className = "",
}: TiltCardProps) {
  return (
    <div
      className={`relative transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_15px_35px_rgba(255,193,7,0.12)] ${className}`}
    >
      {children}
    </div>
  );
}
