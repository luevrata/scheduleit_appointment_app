import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
const defaultQueryClientOptions = {
  queries: { staleTime: 600000 },
};
const queryClient = new QueryClient({
  defaultOptions: defaultQueryClientOptions,
});
root.render(
  <QueryClientProvider client={queryClient}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </Router>
  </QueryClientProvider>,
);
