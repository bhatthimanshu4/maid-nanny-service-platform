export default function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
      <div className="text-xl font-bold text-gray-900">
        Helper<span className="text-green-600">4U</span>
      </div>

      <div className="flex items-center gap-8 text-sm text-gray-600">
        <a href="#">Find a Helper</a>
        <a href="#">How It Works</a>
        <a href="#">For Helpers</a>
        <a href="/auth/login">Login</a>

        <a
  href="/auth/signup"
  className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white"
>
  Get Started
</a>
      </div>
    </nav>
  );
}