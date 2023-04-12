import React, { useState, useEffect } from "react";

import PageTitle from "../../components/Typography/PageTitle";
import { AiOutlineEye } from "react-icons/ai";
import UserDetails from "../../components/Users/UserDetails";
import { Dropdown, DropdownItem } from "@windmill/react-ui";

import {
  Table,
  TableHeader,
  Input,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
} from "@windmill/react-ui";
import {
  EditIcon,
  SearchIcon,
  ChatIcon,
  ForbiddenIcon,
  FormsIcon,
} from "../../icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../../utils/URL";
// import { toast } from "react-toastify";

function Users() {
  const [page, setPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(1);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [search, setSearch] = useState("");
  const [isUserDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [isBanModalOpen, setBanModal] = useState(false);
  const [isInfoModalOpen, setInfoModal] = useState(false);
  const [modalText, setModalText] = useState("");

  function onPageChange(p) {
    setPage(p);
    getUsers();
  }

  useEffect(() => {
    getUsers();
  }, []);

  const closeModal = () => {
    setUserDetailsModalOpen(false);
  };

  const searchUser = (e) => {
    setSearch(e.target.value);
    getUsers();
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `${url}/users?page=${page}&&search=${search}`
      );
      console.log(response?.data);
      setUsers(response?.data?.data?.users);
      setTotalUsers(response?.data?.results);
    } catch (err) {
      console.log("uer", err);
    }
  };
  const banUser = async () => {
    setBanModal(false);
    try {
      const response = await axios.post(`${url}/users/banUser/${user?._id}`);
      getUsers();
      setModalText(`${user?.full_name} was banned`);
      setTimeout(() => setInfoModal(false), 10000);
      setInfoModal(true);
    } catch (err) {
      console.log("uer", err);
    }
  };
  const unbanUser = async () => {
    setBanModal(false);
    try {
      const response = await axios.post(`${url}/users/unbanUser/${user?._id}`);
      getUsers();
      setModalText(`${user?.full_name} was unbanned`);
      setTimeout(() => setInfoModal(false), 1000);
      setInfoModal(true);
    } catch (err) {
      console.log("uer", err);
    }
  };
  const sendEmail = async (uid) => {
    try {
      const response = await axios.post(`${url}/users/sendEmail/${uid}`);
      getUsers();
    } catch (err) {
      console.log("uer", err);
    }
  };

  return (
    <>
      <PageTitle>User Details</PageTitle>
      <div className="">
        <Button iconRight={FormsIcon} tag={Link} to={`/app/addUser/-1`}>
          <span>Add new User</span>
        </Button>
      </div>
      <div className="flex justify-center flex-1 lg:mr-32 my-8">
        <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <SearchIcon className="w-4 h-4" aria-hidden="true" />
          </div>
          <Input
            className="pl-8 text-gray-700"
            placeholder="Search for users"
            aria-label="Search"
            onChange={searchUser}
          />
        </div>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created Data</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {users.length > 0 &&
              users.map((user, i) => (
                <>
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={`http://localhost:5000/static/users/${user.user_image}`}
                          alt="User avatar"
                        />
                        <div>
                          <p className="font-semibold">{user.full_name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user.job}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{user.user_role}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          tag={Link}
                          layout="outline"
                          to={`/app/addUser/${user._id}`}
                          size="icon"
                          aria-label="Edit"
                        >
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button
                          layout="outline"
                          size="icon"
                          aria-label="view"
                          onClick={() => {
                            setUser(user);
                            setUserDetailsModalOpen(true);
                          }}
                        >
                          <AiOutlineEye
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        </Button>
                        <Button
                          layout="outline"
                          size="icon"
                          title="ban user"
                          onClick={() => {
                            setUser(user);
                            setBanModal(true);
                          }}
                        >
                          <ForbiddenIcon
                            className={
                              user?.user_banned
                                ? `text-red-500 w-5 h-5`
                                : `text-green-500 w-5 h-5`
                            }
                            aria-hidden="true"
                          />
                        </Button>
                        <Button
                          layout="outline"
                          size="icon"
                          title="send email"
                          onClick={() => sendEmail(user?._id)}
                        >
                          <ChatIcon className="w-5 h-5`" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalUsers}
            resultsPerPage={10}
            onChange={onPageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
      <Modal isOpen={isUserDetailsModalOpen} onClose={closeModal}>
        <ModalBody>
          <UserDetails user={user} />
        </ModalBody>
      </Modal>
      <Modal isOpen={isInfoModalOpen} onClose={() => setInfoModal(false)}>
        <ModalBody>{modalText}</ModalBody>
      </Modal>

      <Modal isOpen={isBanModalOpen} onClose={() => setBanModal(false)}>
        <ModalHeader>Ban User</ModalHeader>
        <ModalBody>
          Are you sure you want to {user?.user_banned ? "unban" : "ban"}{" "}
          {user?.full_name}?
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button
              onClick={
                user?.user_banned
                  ? () => unbanUser(user?._id)
                  : () => banUser(user?._id)
              }
            >
              yes
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Users;
