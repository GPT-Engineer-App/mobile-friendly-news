import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ChakraProvider, ColorModeProvider } from "@chakra-ui/react";
import Index from "./pages/Index.jsx";

function App() {
  return (
    <ChakraProvider>
      <ColorModeProvider>
        <Router>
          <Routes>
            <Route exact path="/" element={<Index />} />
          </Routes>
        </Router>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
