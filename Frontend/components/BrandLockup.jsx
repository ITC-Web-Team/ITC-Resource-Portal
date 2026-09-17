export default function BrandLockup({ iconClassName = "h-9" }) {
  return (
    <span className="flex items-center gap-3">
      <img
        src="/logo-icon.png"
        alt="itc"
        className={`${iconClassName} w-auto shrink-0`}
      />
      <span className="hidden text-sm font-extrabold uppercase tracking-[0.2em] text-[#FD6E59] sm:inline">
        Resources Portal
      </span>
    </span>
  );
}
