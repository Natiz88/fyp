const routes = [
  {
    path: "/app/dashboard",
    icon: "HomeIcon",
    name: "Dashboard",
  },
  {
    path: "/app/PendingVerifications",
    icon: "CardsIcon",
    name: "Pending Verifications",
  },
  {
    path: "/app/messages",
    icon: "MailIcon",
    name: "Messages",
  },
  {
    icon: "ModalsIcon",
    name: "FAQs",
    routes: [
      {
        path: "/app/faqs",
        name: "FAQs",
      },
      {
        path: "/app/addfaqs/-1",
        name: "Add FAQs",
      },
    ],
  },
  {
    icon: "ModalsIcon",
    path: "/app/rewards",
    name: "Rewards",
  },
  {
    icon: "ForbiddenIcon",
    name: "Reports",
    routes: [
      // submenu
      {
        path: "/app/reportedQuestions",
        name: "Questions",
      },
      {
        path: "/app/reportedAnswers",
        name: "Answers",
      },
      {
        path: "/app/reportedComments",
        name: "Comments",
      },
    ],
  },
  {
    icon: "PeopleIcon",
    name: "Users",
    routes: [
      // submenu
      {
        path: "/app/users",
        name: "Users",
      },
      {
        path: "/app/adduser/-1",
        name: "AddUser",
      },
    ],
  },
  {
    icon: "PeopleIcon",
    name: "Gifts",
    routes: [
      // submenu
      {
        path: "/app/gifts",
        name: "Gifts",
      },
      {
        path: "/app/addgifts/-1",
        name: "AddGift",
      },
    ],
  },
];

export default routes;
