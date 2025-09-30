import React, { useEffect } from "react";
import Routes from "./Routes";
import { initializeDemoUsers } from "./utils/authUtils";
import "./styles/index.css";

function App() {
  useEffect(() => {
    // Initialize demo users for testing on first app load
    initializeDemoUsers();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Routes />
    </div>
  );
}

export default App;
