import App from "./App";
import { createBrowserRouter } from "react-router-dom";
import Popular from "./pages/Popular";
import NowPlaying from "./pages/NowPlaying";
import Coming from "./pages/Comming";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "coming-soon",
        element: <Coming />,
        children: [
          {
            path: "movies/:id",
            element: <Coming />
          }
        ]
      },
      {
        path: "now-playing",
        element: <NowPlaying />,
        children: [
          {
            path: "movies/:id",
            element: <NowPlaying />
          }
        ]
      },
      {
        path: "",
        element: <Popular />,
        children: [
          {
            path: "movies/:id",
            element: <Popular />
          }
        ]
      }
    ]
  }
]);
