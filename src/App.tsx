import { AppRouter } from '@/app/router/AppRouter';
import ThemeProvider from '@/app/providers/ThemeProvider';
import {
  DiscoverProvider,
  FiltersProvider,
  OnboardingProvider,
  ProfileProvider,
} from '@/app/providers/roomie-flow';

function App() {
  return (
    <ThemeProvider>
      <OnboardingProvider>
        <FiltersProvider>
          <DiscoverProvider>
            <ProfileProvider>
              <AppRouter />
            </ProfileProvider>
          </DiscoverProvider>
        </FiltersProvider>
      </OnboardingProvider>
    </ThemeProvider>
  );
}

export default App;
