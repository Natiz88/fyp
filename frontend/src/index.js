import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import Store from "./Redux/Store";
import { QueryClient, QueryClientProvider } from "react-query";
import { SocketContext, socket } from "./Socket";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
  <Provider store={Store}>
    <SocketContext.Provider value={socket}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </SocketContext.Provider>
  </Provider>
);
