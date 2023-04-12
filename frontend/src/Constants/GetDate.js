export const GetDate = (createdAt) => {
  let created_date = new Date(createdAt);

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = created_date.getFullYear();
  const month = months[created_date.getMonth()];
  const date = created_date.getDate();
  return date + " " + month + "," + year;
};
