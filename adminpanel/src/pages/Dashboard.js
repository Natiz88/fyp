import React, { useState, useEffect } from "react";
import InfoCard from "../components/Cards/InfoCard";
import ChartCard from "../components/Chart/ChartCard";
import { Doughnut, Line } from "react-chartjs-2";
import ChartLegend from "../components/Chart/ChartLegend";
import PageTitle from "../components/Typography/PageTitle";
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from "../icons";
import RoundIcon from "../components/RoundIcon";
import response from "../utils/demo/tableData";
import { Avatar, Badge, Pagination } from "@windmill/react-ui";
import axios from "axios";
import { url } from "../utils/URL";

import {
  doughnutOptions,
  lineOptions,
  roleLegends,
  lineLegends,
} from "../utils/demo/chartsData";

function Dashboard() {
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState(0);
  const [questions, setQuestions] = useState(0);
  const [teachers, setTeachers] = useState(0);
  const [students, setStudents] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  const [admins, setAdmins] = useState(users - students - teachers);

  const roleOptions = {
    data: {
      datasets: [
        {
          data: [3, 3, 1],
          backgroundColor: ["#0694a2", "#1c64f2", "#7e3af2"],
          label: "Dataset 1",
        },
      ],
      labels: ["Teachers", "Students", "Admins"],
    },
    options: {
      responsive: true,
      cutoutPercentage: 80,
    },
    legend: {
      display: false,
    },
  };

  // pagination change control
  function onPageChange(p) {
    setPage(p);
  }

  const getDashboardDetails = async () => {
    try {
      const response = await axios.get(`${url}/users/dashboard`);
      setUsers(response?.data?.data?.users);
      setTeachers(response?.data?.data?.teachers);
      setPendingVerifications(response?.data?.data?.pendingVerifications);
      setQuestions(response?.data?.data?.questions);
    } catch (err) {
      console.log("uer", err);
    }
  };

  useEffect(() => {
    getDashboardDetails();
  }, []);

  return (
    <>
      <PageTitle>Dashboard</PageTitle>
      {/* <!-- Cards --> */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard title="Total Users" value={users}>
          <RoundIcon
            icon={PeopleIcon}
            iconColorClass="text-orange-500 dark:text-orange-100"
            bgColorClass="bg-orange-100 dark:bg-orange-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Total Questions" value={questions}>
          <RoundIcon
            icon={MoneyIcon}
            iconColorClass="text-green-500 dark:text-green-100"
            bgColorClass="bg-green-100 dark:bg-green-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Teachers" value={teachers}>
          <RoundIcon
            icon={CartIcon}
            iconColorClass="text-blue-500 dark:text-blue-100"
            bgColorClass="bg-blue-100 dark:bg-blue-500"
            className="mr-4"
          />
        </InfoCard>

        <InfoCard title="Pending Verifications" value={pendingVerifications}>
          <RoundIcon
            icon={ChatIcon}
            iconColorClass="text-teal-500 dark:text-teal-100"
            bgColorClass="bg-teal-100 dark:bg-teal-500"
            className="mr-4"
          />
        </InfoCard>
      </div>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Users">
          <Doughnut {...roleOptions} />
          <ChartLegend legends={roleLegends} />
        </ChartCard>

        <ChartCard title="Traffic">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>
      </div>
    </>
  );
}

export default Dashboard;
