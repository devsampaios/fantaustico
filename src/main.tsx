import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import Home from './views/home/Home';
import Campaigns from './views/donations/Campaigns';
import NewCampaign from './views/donations/NewCampaign';
import RegisterPet from './views/pets/RegisterPet';
import PanelView from './views/panel/Panel';
import Reports from './views/reports/Reports';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PanelView />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'registrar',
        element: <RegisterPet />,
      },
      {
        path: 'campanhas',
        element: <Campaigns />,
      },
      {
        path: 'doacao',
        element: <NewCampaign />,
      },
      {
        path: 'casos',
        element: <Reports />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
