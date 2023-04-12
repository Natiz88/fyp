import { lazy } from "react";

const BrowsePosts = lazy(() => import("../Pages/BrowsePosts"));

const Routes = [
  {
    path: "/",
    component: BrowsePosts,
  },
];

export default Routes;
