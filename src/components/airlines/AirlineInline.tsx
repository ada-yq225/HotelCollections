import { AirlineLogo } from "./AirlineLogo";

type AirlineInlineProps = {
  iata: string;
  nameZh: string;
  subtitle?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
};

export function AirlineInline({
  iata,
  nameZh,
  subtitle,
  size = "sm",
  className = "",
}: AirlineInlineProps) {
  return (
    <div className={`flex min-w-0 items-center gap-2.5 ${className}`}>
      <AirlineLogo iata={iata} nameZh={nameZh} size={size} />
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-[#1a1a1a]">{nameZh}</p>
        {subtitle && (
          <p className="truncate text-[10px] text-[#9ca3af]">{subtitle}</p>
        )}
      </div>
    </div>
  );
}