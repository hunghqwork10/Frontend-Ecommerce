import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.tsx';
import QueryProvider from './providers/QueryProvider.tsx';
import ErrorBoundary from './components/common/ErrorBoundary';
import ToastContainer from './components/common/Toast';

async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start({ onUnhandledRequest: 'bypass' })
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ErrorBoundary>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
        <ToastContainer />
      </ErrorBoundary>
    </React.StrictMode>
  )
})
