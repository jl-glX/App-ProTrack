import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { BudgetDetail } from './pages/BudgetDetail';
import { CreateBudgetPage } from './pages/CreateBudgetPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { LegalPage } from './pages/LegalPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { CookieConsent } from './components/CookieConsent';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-budget" element={<CreateBudgetPage />} />
          <Route path="/budgets/:id" element={<BudgetDetail />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/legal/:section" element={<LegalPage />} />
        </Routes>
      <CookieConsent />
    </BrowserRouter>
  );
}

export default App;
