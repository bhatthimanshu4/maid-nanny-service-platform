const icons = ["😊", "🤝", "🧹", "🧽", "🧤", "🧺", "🏠", "✨", "💼", "🫶"];

function WallpaperTrack({ className }: { className: string }) {
  return (
    <div aria-hidden="true" className={`auth-wallpaper-track ${className}`}>
      {[...icons, ...icons].map((icon, index) => (
        <span
          key={`${icon}-${index}`}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-white bg-surface/80 text-3xl shadow-md backdrop-blur-sm sm:h-[4.5rem] sm:w-[4.5rem]"
        >
          {icon}
        </span>
      ))}
    </div>
  );
}

export default function AuthWallpaper({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <aside className="relative flex min-h-[260px] overflow-hidden border-b border-border bg-gradient-to-br from-background via-primary/20 to-primary-dark/20 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="absolute inset-0" aria-hidden="true">
        <WallpaperTrack className="auth-wallpaper-track-one" />
        <WallpaperTrack className="auth-wallpaper-track-two" />
        <WallpaperTrack className="auth-wallpaper-track-three" />
        <WallpaperTrack className="auth-wallpaper-track-four" />
        <div className="absolute inset-0 bg-background/30" />
      </div>

      <div className="relative z-10 flex w-full flex-col justify-between gap-5 p-5 sm:p-8 lg:p-10 xl:p-14">
        <p className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Helper<span className="text-primary-dark">4U</span>
        </p>

        <div className="max-w-lg rounded-[1.5rem] border border-white/90 bg-surface/80 p-5 shadow-xl backdrop-blur-md sm:rounded-[2rem] sm:p-8 xl:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-dark sm:text-sm">
            Care starts here
          </p>
          <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-foreground sm:mt-4 sm:text-4xl xl:text-5xl">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-6 text-foreground/75 sm:mt-5 sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>

        <p className="hidden text-sm font-medium text-foreground/70 sm:block">
          Trusted help. Happier homes.
        </p>
      </div>
    </aside>
  );
}
