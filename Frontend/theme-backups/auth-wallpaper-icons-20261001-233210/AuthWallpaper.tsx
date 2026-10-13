function SmileIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="32" r="24" />
      <path d="M23 27h.1M41 27h.1" strokeLinecap="round" strokeWidth="5" />
      <path d="M21 37c2.5 5.5 6.2 8 11 8s8.5-2.5 11-8" strokeLinecap="round" />
    </svg>
  );
}

function HelpingHandsIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="m8 35 12-13 8 1 8 8-5 5-7-5-8 9-8-5Z" />
      <path d="m56 35-12-13-8 1-9 9 5 5 8-6 8 9 8-5Z" />
      <path d="m23 37 8 8c2 2 5-1 3-3m-6-2 8 8c2 2 5-1 3-3m-5-2 6 6c2 2 5-1 3-3" strokeLinecap="round" />
      <path d="m27 15 5-6 5 6-5 5-5-5Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="m8 30 24-20 24 20v26H8V30Z" strokeLinejoin="round" />
      <path d="M25 56V38h14v18M43 19v-8h8v15" strokeLinejoin="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="8" y="21" width="48" height="34" rx="5" />
      <path d="M22 21v-7a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v7M8 34h48M27 34v6h10v-6" strokeLinejoin="round" />
    </svg>
  );
}

function BroomIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="m43 9-24 35" strokeLinecap="round" />
      <path d="m13 38 19 13-6 8L7 46l6-8Z" strokeLinejoin="round" />
      <path d="m13 48 4-6m2 10 4-6m3 10 4-6" strokeLinecap="round" />
    </svg>
  );
}

function SpongeIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="10" y="17" width="44" height="32" rx="9" />
      <path d="M20 27h.1M31 36h.1M43 26h.1M20 41h.1M44 40h.1" strokeLinecap="round" strokeWidth="4" />
    </svg>
  );
}

function GlovesIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M21 53 12 36a4 4 0 0 1 7-4l5 7-6-23a4 4 0 0 1 8-2l5 19-1-22a4 4 0 0 1 8 0l1 21 2-16a4 4 0 0 1 8 1l-2 25c-1 7-6 11-13 11H21Z" strokeLinejoin="round" />
    </svg>
  );
}

function BasketIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="m12 28 5 28h30l5-28H12Z" strokeLinejoin="round" />
      <path d="m22 28 6-16m14 16-6-16M22 37v10m10-10v10m10-10v10" strokeLinecap="round" />
    </svg>
  );
}

function SprayIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M23 20h23l5 8v28H18V29l5-9Z" strokeLinejoin="round" />
      <path d="M27 20v-7h15l5 7m-5-7h10M24 36h18m-14 7h12" strokeLinecap="round" />
      <path d="M52 13h6m-4-5 4-3m-3 12 5 2" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 53 11 33C-1 17 17 5 29 17l3 4 3-4C47 5 65 17 53 33L32 53Z" strokeLinejoin="round" />
      <path d="m22 33 7 7 13-15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <path d="M32 6c2 16 10 24 26 26-16 2-24 10-26 26C30 42 22 34 6 32 22 30 30 22 32 6Z" strokeLinejoin="round" />
      <path d="M51 5v12m6-6H45M10 46v12m6-6H4" strokeLinecap="round" />
    </svg>
  );
}

const icons = [
  SmileIcon,
  HelpingHandsIcon,
  HomeIcon,
  BroomIcon,
  BriefcaseIcon,
  SpongeIcon,
  GlovesIcon,
  BasketIcon,
  SprayIcon,
  HeartIcon,
  SparkleIcon,
];

function WallpaperTrack({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`auth-wallpaper-track ${className}`}>
      {[...icons, ...icons].map((Icon, index) => (
        <span
          key={`${index}-${index % icons.length}`}
          className={`flex shrink-0 items-center justify-center text-white/90 ${index % 3 === 0 ? "h-[4.75rem] w-[4.75rem]" : "h-14 w-14"}`}
        >
          <Icon />
        </span>
      ))}
    </div>
  );
}

export default function AuthWallpaper() {
  return (
    <aside
      aria-hidden="true"
      className="auth-wallpaper-panel relative min-h-[260px] overflow-hidden lg:min-h-screen"
    >
      <div className="absolute inset-0">
        <WallpaperTrack className="auth-wallpaper-track-one" />
        <WallpaperTrack className="auth-wallpaper-track-two" />
        <WallpaperTrack className="auth-wallpaper-track-three" />
        <WallpaperTrack className="auth-wallpaper-track-four" />
        <WallpaperTrack className="auth-wallpaper-track-five" />
        <WallpaperTrack className="auth-wallpaper-track-six" />
        <WallpaperTrack className="auth-wallpaper-track-seven" />
        <WallpaperTrack className="auth-wallpaper-track-eight" />
        <WallpaperTrack className="auth-wallpaper-track-nine" />
        <WallpaperTrack className="auth-wallpaper-track-ten" />
        <WallpaperTrack className="auth-wallpaper-track-eleven" />
      </div>
    </aside>
  );
}
