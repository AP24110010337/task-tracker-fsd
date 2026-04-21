import { NavLink, Outlet, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const DashboardIcon = () => (
  <svg className="app-shell__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="3" width="7" height="7" rx="1.5" strokeWidth="1.8" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" strokeWidth="1.8" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" strokeWidth="1.8" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" strokeWidth="1.8" />
  </svg>
);

const TaskIcon = () => (
  <svg className="app-shell__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M9 11.5 11 13.5 15.5 9" strokeWidth="1.8" strokeLinecap="round" />
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="1.8" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="app-shell__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path
      d="M10 17 15 12 10 7"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15 12H3" strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M13 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const AppLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    [
      "app-shell__nav-link",
      isActive ? "app-shell__nav-link--active" : "app-shell__nav-link--inactive"
    ].join(" ");

  return (
    <div className="app-shell">
      <header className="app-shell__header content-panel">
        <div className="app-shell__header-inner">
          <div className="app-shell__brand-group">
            <div className="app-shell__brand">Task Track</div>

            <nav className="app-shell__nav app-shell__nav--desktop">
              <NavLink to="/dashboard" className={navItemClass}>
                <DashboardIcon />
                Dashboard
              </NavLink>
              <NavLink to="/tasks" className={navItemClass}>
                <TaskIcon />
                Tasks
              </NavLink>
            </nav>
          </div>

          <div className="app-shell__user-bar">
            <p className="app-shell__greeting">
              Hi, <span className="app-shell__greeting-name">{user?.username}</span>
            </p>

            <button
              type="button"
              className="button button--primary app-shell__logout-button"
              onClick={handleLogout}
            >
              <LogoutIcon />
              Logout
            </button>
          </div>
        </div>

        <nav className="app-shell__nav app-shell__nav--mobile">
          <NavLink to="/dashboard" className={navItemClass}>
            <DashboardIcon />
            Dashboard
          </NavLink>
          <NavLink to="/tasks" className={navItemClass}>
            <TaskIcon />
            Tasks
          </NavLink>
        </nav>
      </header>

      <main className="app-shell__main">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
