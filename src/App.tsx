import { AppRouter } from '@/app/router/AppRouter';
import ThemeProvider from '@/app/providers/ThemeProvider';
import { RoomieFlowProvider } from '@/app/providers/roomie-flow';

function App() {
  return (
    <ThemeProvider>
      <RoomieFlowProvider>
        <AppRouter />
      </RoomieFlowProvider>
    </ThemeProvider>
  );
}

export default App;
