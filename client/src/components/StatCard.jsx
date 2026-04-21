const stylesByTone = {
  brand: {
    wrapper: "stat-card__icon-box stat-card__icon-box--brand"
  },
  green: {
    wrapper: "stat-card__icon-box stat-card__icon-box--green"
  },
  amber: {
    wrapper: "stat-card__icon-box stat-card__icon-box--amber"
  },
  purple: {
    wrapper: "stat-card__icon-box stat-card__icon-box--purple"
  }
};

const icons = {
  tasks: (
    <svg className="stat-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M8 12.5 10.2 14.5 16 8.75" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    </svg>
  ),
  completed: (
    <svg className="stat-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path
        d="M7 12.5 10.2 15.5 17 8.75"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    </svg>
  ),
  progress: (
    <svg className="stat-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 7v5l3.5 2" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    </svg>
  ),
  time: (
    <svg className="stat-card__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
    </svg>
  )
};

const StatCard = ({ title, value, icon, tone = "brand" }) => {
  const selectedStyle = stylesByTone[tone] || stylesByTone.brand;

  return (
    <div className="stat-card content-panel">
      <div className={selectedStyle.wrapper}>
        {icons[icon]}
      </div>

      <div>
        <p className="stat-card__label">{title}</p>
        <h3 className="stat-card__value">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
