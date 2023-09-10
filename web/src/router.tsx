import { createBrowserRouter } from 'react-router-dom';

import Root from './pages/Root';
import Error from './pages/Error';
import Game from 'pages/Game';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Game />
      }
    ]
  }
]);
