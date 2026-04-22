import { Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const FeatureIcon = ({ children, tone }) => {
  const toneClasses = {
    brand: "bg-brand/10 text-brand",
    green: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600"
  };

  return (
    <div
      className={[
        "flex h-14 w-14 items-center justify-center rounded-2xl",
        toneClasses[tone] || toneClasses.brand
      ].join(" ")}
    >
      {children}
    </div>
  );
};

const TaskIcon = () => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M8 12.5 10.2 14.5 16 8.75" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
  </svg>
);

const TimerIcon = () => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M12 7v5l3 2" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M9 3h6" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="13" r="8" strokeWidth="1.8" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 19V10" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M10 19V5" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M16 19v-7" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M20 19V8" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const featureItems = [
  {
    title: "Task Management",
    description:
      "Create tasks with a title, description, and priority, then update them as work moves ahead.",
    icon: <TaskIcon />,
    tone: "brand"
  },
  {
    title: "Time Tracking",
    description:
      "Start and stop a timer on one task at a time so the time log stays simple and clear.",
    icon: <TimerIcon />,
    tone: "amber"
  },
  {
    title: "Progress Dashboard",
    description:
      "View total tasks, completed tasks, in-progress tasks, and time spent in one dashboard.",
    icon: <DashboardIcon />,
    tone: "green"
  }
];

const workflowSteps = [
  {
    step: "01",
    title: "Create Task",
    description: "Add the task details and save it to your task list."
  },
  {
    step: "02",
    title: "Track Time",
    description: "Start the timer while working and stop it when the work ends."
  },
  {
    step: "03",
    title: "Check Dashboard",
    description: "Review task counts and tracked time in a simple summary."
  }
];

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="content-panel sticky top-0 z-20 rounded-none border-x-0 border-t-0 px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-4xl font-bold tracking-tight text-brand">Task Track</div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="button button--secondary"
              onClick={() => scrollToSection("features")}
            >
              Features
            </button>

            <button
              type="button"
              className="button button--secondary"
              onClick={() => scrollToSection("get-started")}
            >
              Get Started
            </button>

            {isAuthenticated ? (
              <Link to="/dashboard" className="button button--primary">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="button button--secondary">
                  Login
                </Link>
                <Link to="/signup" className="button button--primary">
                  Create One
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
              Task & Time Tracking System
            </p>
            <h1 className="mt-6 text-5xl font-bold tracking-tight text-slate-900 md:text-6xl">
              Manage tasks and track your work with a simple system.
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-600">
              Task Track helps users create tasks, record time spent on them, update task
              status, and monitor progress through a clean dashboard.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                className="button button--primary"
                onClick={() => scrollToSection("get-started")}
              >
                Get Started
              </button>

              <button
                type="button"
                className="button button--secondary"
                onClick={() => scrollToSection("features")}
              >
                View Features
              </button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="content-panel p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Tasks
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">Create</p>
              </div>
              <div className="content-panel p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Timer
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">Track</p>
              </div>
              <div className="content-panel p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Dashboard
                </p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">Monitor</p>
              </div>
            </div>
          </div>

          <div className="content-panel p-6">
            <div className="border-b border-slate-200 pb-5">
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Quick Dashboard Preview</h2>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-brand/10 p-5">
                <p className="text-sm text-slate-600">Total Tasks</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">8</p>
              </div>
              <div className="rounded-2xl bg-emerald-100 p-5">
                <p className="text-sm text-slate-600">Completed</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">5</p>
              </div>
              <div className="rounded-2xl bg-amber-100 p-5">
                <p className="text-sm text-slate-600">In Progress</p>
                <p className="mt-2 text-4xl font-semibold text-slate-900">2</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-lg font-semibold text-slate-900">Current Work</p>
                <p className="mt-2 text-slate-600">Implement API endpoints and update task status.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-lg font-semibold text-slate-900">Time Spent Per Task</p>
                <div className="mt-3 space-y-3 text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Login Module</span>
                    <span className="font-semibold text-slate-900">2h 10m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Schema</span>
                    <span className="font-semibold text-slate-900">1h 25m</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>API Endpoints</span>
                    <span className="font-semibold text-slate-900">45m</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mt-16">
          <div className="border-b border-slate-200 pb-6">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Features
            </p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              Main features of the system
            </h2>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featureItems.map((feature) => (
              <article key={feature.title} className="content-panel p-6">
                <FeatureIcon tone={feature.tone}>{feature.icon}</FeatureIcon>
                <h3 className="mt-5 text-2xl font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-3 text-slate-600">{feature.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <div className="content-panel p-6 lg:p-8">
            <div className="border-b border-slate-200 pb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
                System Flow
              </p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                How you moves through the app
              </h2>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {workflowSteps.map((item) => (
                <div key={item.step} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="inline-flex rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="get-started" className="mt-16">
          <div className="content-panel p-8 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              Get Started
            </p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">
              Choose how you want to enter the app
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
              You can log in to an existing account or create a new one and then begin using the
              dashboard and task pages.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/dashboard" className="button button--primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="button button--secondary">
                    Login
                  </Link>
                  <Link to="/signup" className="button button--primary">
                    Create One
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
