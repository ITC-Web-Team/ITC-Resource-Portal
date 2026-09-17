export default function BrandLockup({ iconClassName = "h-8" }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src="/logo-icon.png"
        alt=""
        className={`${iconClassName} w-auto shrink-0`}
      />
      <span className="flex items-baseline gap-2">
        <span className="text-xl font-extrabold tracking-tight text-white">
          itc
        </span>
        <span className="hidden text-[11px] font-bold uppercase tracking-[0.15em] text-[#FD6E59] sm:inline">
          Resources Portal
        </span>
      </span>
    </span>
  );
}
