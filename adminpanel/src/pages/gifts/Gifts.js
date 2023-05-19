import React, { useState, useEffect } from "react";

import PageTitle from "../../components/Typography/PageTitle";

import { EditIcon, TrashIcon, FormsIcon } from "./../../icons";
import { MdDone } from "react-icons/md";
import { AiOutlineClose } from "react-icons/ai";
import { ImBlocked } from "react-icons/im";
import { Link } from "react-router-dom";

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

import axios from "axios";
import { url, frontUrl } from "../../utils/URL";
// import { toast } from "react-toastify";

function Gifts() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [gifts, setGifts] = useState([]);
  const [gift, setgift] = useState();
  const [modalMessage, setModalMessage] = useState("");
  const [isgiftDetailsModalOpen, setgiftDetailsModalOpen] = useState(false);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);

  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    getGifts();
  }, []);

  const closeModal = () => {
    setgiftDetailsModalOpen(false);
  };

  const submitSuccess = (message) => {
    setTimeout(() => {
      setSubmitModalOpen(false);
    }, 1000);
    setModalMessage(message);
    getGifts();
    setSubmitModalOpen(true);
  };
  const submitFailure = (err) => {
    setTimeout(() => {
      setSubmitModalOpen(false);
      return;
    }, 1000);
    setModalMessage(err.response.data.message || "An error occured");
    setSubmitModalOpen(true);
  };
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      accept: "application/json",
      authorization: `Bearer ${token}`,
      contentType: "multipart/form-data",
    },
  };

  const getGifts = async () => {
    try {
      const response = await axios.get(`${url}/gifts`);
      console.log(response?.data);
      setGifts(response?.data?.data?.gifts);
      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.log("uer", err);
    }
  };

  const cleargiftedQuestion = async (id) => {
    console.log(id);
    try {
      await axios.post(`${url}/questions/cleargiftedQuestion/${id}`);
      submitSuccess("The question was cleared");
    } catch (err) {
      submitFailure(err);
    }
  };
  const hideQuestion = async (id) => {
    console.log(id);
    try {
      await axios.post(`${url}/questions/hideQuestion/${id}`, {}, config);
      submitSuccess("The question was hidden");
    } catch (err) {
      submitFailure(err);
    }
  };

  if (gifts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No Gifts Yet</p>
      </div>
    );
  }

  const deleteGift = async (id) => {
    try {
      const response = await axios.delete(`${url}/gifts/${id}`);
    } catch (err) {
      console.log("uer", err);
    }
  };

  return (
    <>
      <PageTitle>Gifts</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Posted By</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {gifts &&
              gifts.length > 0 &&
              gifts.map((gift, i) => (
                <>
                  <TableRow key={gift._id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {/* <Avatar
                          className="hidden mr-3 md:block"
                          src={`http://localhost:5000/static/users/${gifts?.user_id?.user_image}`}
                          alt="gift avatar"
                        /> */}
                        <div>
                          <p className="font-semibold">
                            {gift?.added_by || "admin"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" overflow-hidden">
                      <span className="text-sm">{gift.gift_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{gift.gift_price}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(gift.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          tag={Link}
                          layout="outline"
                          to={`/app/addGift/${gift._id}`}
                          size="icon"
                          aria-label="Edit"
                        >
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        {/* <Button
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
                        </Button> */}
                        <Button
                          size="icon"
                          layout="outline"
                          aria-label="Edit"
                          title="delete message"
                          onClick={() => deleteGift(gift._id)}
                        >
                          <TrashIcon className="w-5 h-5" aria-hidden="true" />
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
      {/* <Modal isOpen={isgiftDetailsModalOpen} onClose={closeModal}>
        <ModalBody>
          <giftDetails gift={gift} />
        </ModalBody>
      </Modal>
      <Modal isOpen={isSubmitModalOpen}>{modalMessage}</Modal> */}
    </>
  );
}

export default Gifts;
