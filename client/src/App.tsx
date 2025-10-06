import { QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter as Router } from "react-router-dom";
import ShiftDashboard from "./components/ShiftDashboard";
import { theme } from "./theme";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div
            className="min-h-screen"
            style={{
              background: "linear-gradient(180deg, #F3F7F0 0%, #E8EFE6 100%)",
            }}
          >
            <ShiftDashboard />
          </div>
        </ThemeProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
