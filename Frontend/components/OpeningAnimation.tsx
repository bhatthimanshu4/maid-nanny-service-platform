export default function OpeningAnimation() {
  return (
    <div className="startup-intro" role="status" aria-label="Welcome to Helper4U">
      <div className="startup-intro-content">
        <div className="startup-intro-mark" aria-hidden="true">H</div>
        <p className="startup-intro-name">Helper4U</p>
        <p className="startup-intro-tagline">A little help goes a long way</p>
        <div className="startup-intro-loader" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
