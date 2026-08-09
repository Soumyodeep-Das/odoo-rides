import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { Providers } from './app/providers'
import { Router } from './app/router'
import LiveSplashScreen from '#components/shared/LiveSplashScreen'

// Stubs for initialization checks
const checkAuthToken = async () => Promise.resolve()
const requestLocationPermission = async () => Promise.resolve()

function AppBootstrapper() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function init() {
      await Promise.all([
        checkAuthToken(),              // your real auth check
        requestLocationPermission(),   // your real geolocation call
        new Promise((r) => setTimeout(r, 1500)), // minimum splash time so it doesn't flash
      ]);
      setIsReady(true);
    }
    init();
  }, []);

  if (!isReady) return <LiveSplashScreen />;

  return (
    <Providers>
      <Router />
    </Providers>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppBootstrapper />
  </StrictMode>
)
