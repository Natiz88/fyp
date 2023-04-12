import { lazy } from "react";

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Forms = lazy(() => import("../pages/Forms"));
const Cards = lazy(() => import("../pages/Cards"));
const Charts = lazy(() => import("../pages/Charts"));
const Buttons = lazy(() => import("../pages/Buttons"));
const Modals = lazy(() => import("../pages/Modals"));
const Users = lazy(() => import("../pages/users/Users"));
const Rewards = lazy(() => import("../pages/rewards"));
const Page404 = lazy(() => import("../pages/404"));
const Blank = lazy(() => import("../pages/Blank"));
const AddUser = lazy(() => import("../pages/users/AddUser"));
const FAQs = lazy(() => import("../pages/faqs"));
const Messages = lazy(() => import("../pages/Messages"));
const AddFAQs = lazy(() => import("../pages/faqs/AddFaq"));
const PendingVerifications = lazy(() =>
  import("../pages/PendingVerifications")
);
const ReportedQuestions = lazy(() =>
  import("../pages/reports/ReportedQuestions")
);
const ReportedAnswers = lazy(() => import("../pages/reports/ReportedAnswers"));

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: "/dashboard", // the url
    component: Dashboard, // view rendered
  },
  {
    path: "/forms",
    component: Forms,
  },
  {
    path: "/cards",
    component: Cards,
  },
  {
    path: "/charts",
    component: Charts,
  },
  {
    path: "/buttons",
    component: Buttons,
  },
  {
    path: "/modals",
    component: Modals,
  },
  {
    path: "/users",
    component: Users,
  },
  {
    path: "/pendingVerifications",
    component: PendingVerifications,
  },
  {
    path: "/rewards",
    component: Rewards,
  },
  {
    path: "/404",
    component: Page404,
  },
  {
    path: "/adduser/:id",
    component: AddUser,
  },
  {
    path: "/faqs",
    component: FAQs,
  },
  {
    path: "/addfaqs/:id",
    component: AddFAQs,
  },
  {
    path: "/blank",
    component: Blank,
  },
  {
    path: "/messages",
    component: Messages,
  },
  {
    path: "/reportedQuestions",
    component: ReportedQuestions,
  },
  {
    path: "/reportedAnswers",
    component: ReportedAnswers,
  },
];

export default routes;
