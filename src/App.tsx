import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import HierarchicalGrid from './AgGrid/HierarchicalGrid';
import TanStackHierarchicalGrid from './TanStackGrid/TanStackHierarchicalGrid';
import MuiHierarchicalGrid from './MuiXGrid/MuiHierarchicalGrid';
import MRTGrid from './MaterialReactTable/MRTGrid';
import RDGGrid from './ReactDataGrid/RDGGrid';
import './App.css';

function Home() {
  return (
    <div className="card">
      <h1>Grid Library Comparison</h1>
      <p>Explore high-performance hierarchical grid implementations.</p>

      <div className="nav-menu">
        <Link to="/ag-grid" className="nav-link-card">
          <div className="nav-card-item">
            <span className="badge badge-ag">AG Grid Enterprise</span>
            <h2>AG Grid</h2>
            <p>Best-in-class performance & features.</p>
          </div>
        </Link>
        <Link to="/tanstack" className="nav-link-card">
          <div className="nav-card-item">
            <span className="badge badge-ts">TanStack Table</span>
            <h2>Headless DIY</h2>
            <p>Maximum control, build your own UI.</p>
          </div>
        </Link>
        <Link to="/mui-x" className="nav-link-card">
          <div className="nav-card-item">
            <span className="badge" style={{ background: '#1976d2', color: 'white' }}>MUI X Pro</span>
            <h2>MUI Data Grid</h2>
            <p>Native Material Design integration.</p>
          </div>
        </Link>
        <Link to="/mrt" className="nav-link-card">
          <div className="nav-card-item">
            <span className="badge" style={{ background: '#9c27b0', color: 'white' }}>MRT V3</span>
            <h2>Material React Table</h2>
            <p>MUI wrapper for TanStack Table.</p>
          </div>
        </Link>
        <Link to="/rdg" className="nav-link-card">
          <div className="nav-card-item">
            <span className="badge" style={{ background: '#ddd', color: '#333' }}>React Data Grid</span>
            <h2>Lightweight</h2>
            <p>Simple and fast.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path ? 'active' : '';

  return (
    <div className="app-container">
      <header className="app-header">
        <div style={{ marginRight: 'auto', fontWeight: 800, fontSize: '1.2rem', color: 'var(--text-primary)' }}>
          Grid<span style={{ color: 'var(--accent-color)' }}>Explorer</span>
        </div>
        <nav className="app-header-nav">
          <Link to="/" className={`nav-item ${isActive('/')}`}>Home</Link>
          <Link to="/ag-grid" className={`nav-item ${isActive('/ag-grid')}`}>AG Grid</Link>
          <Link to="/tanstack" className={`nav-item ${isActive('/tanstack')}`}>TanStack</Link>
          <Link to="/mui-x" className={`nav-item ${isActive('/mui-x')}`}>MUI X</Link>
          <Link to="/mrt" className={`nav-item ${isActive('/mrt')}`}>MRT</Link>
          <Link to="/rdg" className={`nav-item ${isActive('/rdg')}`}>RDG</Link>
        </nav>
      </header>
      <main className="app-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ag-grid" element={<HierarchicalGrid />} />
          <Route path="/tanstack" element={<TanStackHierarchicalGrid />} />
          <Route path="/mui-x" element={<MuiHierarchicalGrid />} />
          <Route path="/mrt" element={<MRTGrid />} />
          <Route path="/rdg" element={<RDGGrid />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
