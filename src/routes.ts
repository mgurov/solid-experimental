import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '/fetching',
    component: lazy(() => import('./pages/fetching')),
  },
  {
    path: '/fetching-two',
    component: lazy(() => import('./pages/fetching/TwoFetch')),
  },
  {
    path: '/fetching/guides/fetching-data',
    component: lazy(() => import('./pages/fetching/GuidesFetchingData')),
  },
  {
    path: '/fetching/guides/fetching-data-axios',
    component: lazy(() => import('./pages/fetching/GuidesFetchingDataAxios')),
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
