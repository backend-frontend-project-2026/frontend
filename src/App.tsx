import { AppRouter } from './app/router/AppRouter';
import ThemeProvider from './app/providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
