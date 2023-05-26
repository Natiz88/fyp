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
  const [isgiftDeleteModalOpen, setgiftDeleteModalOpen] = useState(false);
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
      getGifts();
    }, 1000);
    setModalMessage(message);
    setSubmitModalOpen(true);
  };
  const submitFailure = (message) => {
    setTimeout(() => {
      setSubmitModalOpen(false);
      return;
    }, 1000);
    setModalMessage(message);
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

  if (gifts.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="pt-20">No Gifts Yet</p>
      </div>
    );
  }

  const deleteGift = async (id) => {
    try {
      const response = await axios.delete(`${url}/gifts/${id}`);
      submitSuccess("Gift was deleted");
    } catch (err) {
      // submitFailure("An error occured");
      console.log("uer", err);
    }
  };

  return (
    <>
      <PageTitle>Gifts</PageTitle>
      <div className="">
        <Button iconRight={FormsIcon} tag={Link} to={`/app/addgifts/-1`}>
          <span>Add Gift</span>
        </Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Added By</TableCell>
              <TableCell>Image</TableCell>
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
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={gift?.added_by.avatar}
                          alt="gift avatar"
                        />
                        <div>
                          <p className="font-semibold">
                            {gift?.added_by?.full_name || "admin"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" overflow-hidden">
                      <img
                        className="hidden mr-3 md:block"
                        src={`http://localhost:5000/static/gifts/${gift?.gift_image}`}
                        width={80}
                        height={80}
                        alt="gift"
                      />
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
                          to={`/app/addgifts/${gift._id}`}
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
                          onClick={() => {
                            deleteGift(gift._id);
                          }}
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
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      >
        <ModalBody>{modalMessage}</ModalBody>
      </Modal>
      <Modal
        isOpen={isgiftDeleteModalOpen}
        onClose={() => setgiftDeleteModalOpen(false)}
      >
        <ModalHeader>Delete Gift</ModalHeader>
        <ModalBody>Are you sure you want to delete this gift</ModalBody>
        <ModalFooter>
          <div className="hidden sm:block">
            <Button
              layout="outline"
              onClick={() => setgiftDeleteModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
          <div className="hidden sm:block">
            <Button onClick={deleteGift(gift?._id)}>yes</Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default Gifts;
