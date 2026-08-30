import Link from "next/link";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  variant?: "dark" | "light";
}

export function Logo({
  className = "",
  size = "md",
  href = "/",
  variant = "dark",
}: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl sm:text-2xl",
    lg: "text-2xl sm:text-3xl",
    xl: "text-3xl sm:text-4xl",
  };

  const textColor = variant === "light" ? "text-white" : "text-[#0B132B]";

  const content = (
    <span
      className={`inline-flex items-baseline font-black lowercase select-none tracking-tight ${sizeClasses[size]} ${textColor} ${className}`}
      style={{ letterSpacing: "-0.035em" }}
    >
      <span>samud</span>
      <span className="inline-block w-[0.24em] h-[0.24em] bg-[#F59E0B] rounded-[1.5px] mx-[0.05em] self-end mb-[0.18em]" />
      <span>shabkat</span>
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center group">
        {content}
      </Link>
    );
  }

  return content;
}
