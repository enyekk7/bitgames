import { Link, useLocation } from 'react-router-dom';

export default function TabsNav() {
  const location = useLocation();

  const tabs = [
    { path: '/', label: 'Feed' },
    { path: '/games', label: 'Games' }
  ];

  return (
    <nav className="tabs-nav">
      {tabs.map(tab => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`tab ${location.pathname === tab.path ? 'active' : ''}`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
