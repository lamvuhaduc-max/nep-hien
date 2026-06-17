export default function Stats() {
  return (
    <div className="stats-bar" aria-label="Thống kê">
      <div className="wrap stats-inner">
        <div className="stat">
          <strong>8+</strong>
          <span>Năm kinh nghiệm</span>
        </div>
        <div className="stat-divider" aria-hidden="true" />
        <div className="stat">
          <strong>200+</strong>
          <span>Công trình hoàn thành</span>
        </div>
        <div className="stat-divider" aria-hidden="true" />
        <div className="stat">
          <strong>98%</strong>
          <span>Khách hàng hài lòng</span>
        </div>
        <div className="stat-divider" aria-hidden="true" />
        <div className="stat">
          <strong>TP.HCM</strong>
          <span>An Khánh, Quận 2</span>
        </div>
      </div>
    </div>
  );
}
