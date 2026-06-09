import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "./Badge";

interface VideoThumbProps {
  src: string;
  alt: string;
  stat?: string;
  className?: string;
  showPlay?: boolean;
}

export function VideoThumb({ src, alt, stat, className, showPlay = true }: VideoThumbProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl overflow-hidden aspect-[4/3] group cursor-pointer",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
      {showPlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-5 h-5 text-gray-800 ml-0.5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
      {stat && (
        <div className="absolute bottom-4 left-4 font-geist">
          <p className="text-white text-3xl font-bold leading-none">{stat}</p>
          <p className="text-white/80 text-sm font-normal mt-1">Engagement rate</p>
        </div>
      )}
    </div>
  );
}
