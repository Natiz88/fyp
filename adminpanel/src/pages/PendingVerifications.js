import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import SectionTitle from "../components/Typography/SectionTitle";
import { AiOutlineEye } from "react-icons/ai";
import UserDetails from "../components/Users/UserDetails";
import { MdDone } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { ImBlocked } from "react-icons/im";

import {
  Table,
  TableHeader,
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
import { EditIcon, TrashIcon } from "../icons";
import axios from "axios";
import { url, frontUrl } from "../utils/URL";
import { Link } from "react-router-dom";

// import { toast } from "react-toastify";

function PendingVerifications() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState();
  const [reject, setReject] = useState("");
  const [isUserDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setRejectModal] = useState(false);
  const [isInfoModalOpen, setInfoModal] = useState(false);
  const [modalText, setModalText] = useState("");

  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    getUsers();
  }, []);

  const closeModal = () => {
    setUserDetailsModalOpen(false);
    setRejectModal(false);
  };

  const getUsers = async () => {
    try {
      const response = await axios.get(`${url}/users/pendingUsers`);
      console.log(response?.data);
      setUsers(response?.data?.data?.users);
      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.log("uer", err);
    }
  };

  const verifyTeacher = async (id) => {
    try {
      const body = {};
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${url}/users/verifyTeacher/${id}`,
        body,
        config
      );
      getUsers();
    } catch (err) {
      console.log("uer", err);
    }
  };
  const cancelVerification = async () => {
    try {
      const body = { reject };
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          accept: "application/json",
          authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.put(
        `${url}/users/cancelVerification/${user?._id}`,
        body,
        config
      );
      getUsers();
      setModalText(`User verification was rejected`);
      setTimeout(() => setInfoModal(false), 10000);
      setInfoModal(true);
    } catch (err) {
      console.log("uer", err);
    }
  };

  return (
    <>
      <PageTitle>Verification Table</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Full Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>KYC Status</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {users &&
              users.length > 0 &&
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
                      <Badge type={user.status}>{user.user_verified}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button layout="link" size="icon" aria-label="Edit">
                          <MdDone
                            className="w-5 h-5"
                            aria-hidden="true"
                            onClick={() => verifyTeacher(user._id)}
                          />
                        </Button>

                        <Button layout="link" size="icon" aria-label="Edit">
                          <AiOutlineClose
                            className="w-5 h-5"
                            aria-hidden="true"
                            onClick={() => {
                              setUser(user);
                              setRejectModal(true);
                            }}
                          />
                        </Button>
                        <Button layout="link" size="icon" aria-label="Edit">
                          <ImBlocked className="w-5 h-5" aria-hidden="true" />
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
            page={page}
            totalResults={totalPages}
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
      <Modal isOpen={isRejectModalOpen} onClose={() => setRejectModal(false)}>
        <ModalHeader>Reject User Verification</ModalHeader>
        <ModalBody>
          Reason for rejection
          <Textarea
            value={reject}
            onChange={(e) => setReject(e.target.value)}
          />
        </ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button layout="outline" onClick={closeModal}>
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={cancelVerification}>Reject</Button>
          </div>
        </ModalFooter>
      </Modal>
      <Modal isOpen={isInfoModalOpen} onClose={() => setInfoModal(false)}>
        <ModalBody>{modalText}</ModalBody>
      </Modal>
    </>
  );
}

export default PendingVerifications;
