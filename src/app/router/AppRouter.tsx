import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { routesConfig } from './config/routesConfig';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {routesConfig.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
};
