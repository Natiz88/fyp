import React, { useState, useEffect } from "react";

import PageTitle from "./../../components/Typography/PageTitle";

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
import { EditIcon, TrashIcon } from "../../icons";

import { url, frontUrl } from "../../utils/URL";
// import { toast } from "react-toastify";

function FAQs() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [faqs, setfaqs] = useState([]);
  const [faq, setfaq] = useState();
  const [modalMessage, setModalMessage] = useState("");
  const [isfaqDetailsModalOpen, setfaqDetailsModalOpen] = useState(false);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);

  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    getFaqs();
  }, []);

  const closeModal = () => {
    setfaqDetailsModalOpen(false);
  };

  const getFaqs = async () => {
    try {
      const response = await axios.get(`${url}/faq`);
      setfaqs(response?.data?.data?.FAQs);
      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.log("uer", err);
    }
  };
  const deleteFAQ = async (id) => {
    try {
      const response = await axios.delete(`${url}/faq/${id}`);
      getFaqs();
    } catch (err) {
      console.log("uer", err);
    }
  };

  if (faqs && faqs.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No Data</p>
      </div>
    );
  }
  console.log("fa", faqs);

  return (
    <>
      <PageTitle>FAQs</PageTitle>
      <div>
        <Button tag={Link} to={`app/addfaqs/-1`}>
          Add FAQ
        </Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>S.N.</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Added By</TableCell>
              <TableCell>Updated By</TableCell>
              <TableCell>Updated Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {faqs &&
              faqs.length > 0 &&
              faqs.map((faq, i) => (
                <>
                  <TableRow key={faq._id}>
                    <TableCell className="max-w-xl overflow-hidden">
                      <span className="text-sm">{i + 1}</span>
                    </TableCell>
                    <TableCell className="max-w-xl overflow-hidden">
                      <span className="text-sm">{faq.question}</span>
                    </TableCell>
                    <TableCell className="max-w-xl overflow-hidden">
                      <span className="text-sm">{faq.answer}</span>
                    </TableCell>
                    <TableCell className="max-w-2xl overflow-hidden">
                      <span className="text-sm">{faq.added_by?.full_name}</span>
                    </TableCell>
                    <TableCell className="max-w-2xl overflow-hidden">
                      <span className="text-sm">{faq.full_name}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(faq.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          tag={Link}
                          to={`/app/addfaqs/${faq._id}`}
                          title="clear post"
                          size="icon"
                          aria-label="Edit"
                        >
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button
                          title="delete faq"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => deleteFAQ(faq._id)}
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
      <Modal isOpen={isfaqDetailsModalOpen} onClose={closeModal}>
        <ModalBody>
          <faqDetails faq={faq} />
        </ModalBody>
      </Modal>
      <Modal isOpen={isSubmitModalOpen}>{modalMessage}</Modal>
    </>
  );
}

export default FAQs;
