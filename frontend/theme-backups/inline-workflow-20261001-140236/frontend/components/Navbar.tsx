export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-border bg-surface px-8 py-5">
      <div className="text-xl font-bold text-foreground">
        Helper<span className="text-primary-dark">4U</span>
      </div>

      <div className="flex items-center gap-8 text-sm text-foreground">
        <a href="#">Find a Helper</a>
        <a href="#">How It Works</a>
        <a href="#">For Helpers</a>
        <a href="/auth/login">Login</a>

        <a
  href="/auth/signup"
  className="rounded-lg bg-primary px-5 py-2.5 font-medium text-foreground"
>
  Get Started
</a>
      </div>
    </nav>
  );
}