import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ROUTES_ARRAY } from "./constant/routeBuilder";

const routeBuilder = createBrowserRouter(ROUTES_ARRAY);

const Routes = () => {
  return <RouterProvider router={routeBuilder} />;
};

export default Routes;
