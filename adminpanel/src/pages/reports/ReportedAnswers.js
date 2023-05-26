import React, { useState, useEffect } from "react";

import PageTitle from "./../../components/Typography/PageTitle";

import { AiOutlineEye } from "react-icons/ai";
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

function ReportedAnswers() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reports, setReports] = useState([]);
  const [report, setReport] = useState();
  const [modalMessage, setModalMessage] = useState("");
  const [isreportDetailsModalOpen, setReportDetailsModalOpen] = useState(false);
  const [isSubmitModalOpen, setSubmitModalOpen] = useState(false);

  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    getreports();
  }, []);

  const closeModal = () => {
    setReportDetailsModalOpen(false);
  };

  const submitSuccess = () => {
    setTimeout(() => {
      setSubmitModalOpen(false);
    }, 1000);
    setModalMessage("The answer was cleared");
    getreports();
    setSubmitModalOpen(true);
  };
  const submitFailure = (err) => {
    setTimeout(() => {
      setSubmitModalOpen(false);
      return;
    }, 1000);
    setModalMessage(err.response.data.message);
    setSubmitModalOpen(true);
  };

  const getreports = async () => {
    try {
      const response = await axios.get(`${url}/answers/ReportedAnswers`);
      setReports(response?.data?.data?.answers);
      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.log("uer", err);
    }
  };

  const clearReportedAnswer = async (id) => {
    try {
      await axios.post(`${url}/answers/clearReportedAnswer/${id}`);
      submitSuccess();
    } catch (err) {
      submitFailure(err);
    }
  };

  if (reports.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>No Reported answers</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle>Reported answers</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Posted By</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {reports &&
              reports.length > 0 &&
              reports.map((report, i) => (
                <>
                  <TableRow key={report._id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={report?.user_id?.avatar}
                          alt="report avatar"
                        />
                        <div>
                          <p className="font-semibold">
                            {report?.user_id?.full_name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {report?.job}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-2xl overflow-hidden">
                      <span className="text-sm">{report.answer_body}</span>
                    </TableCell>
                    <TableCell>
                      <Badge>{report.answer_reports.length}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          title="clear post"
                          size="icon"
                          aria-label="Edit"
                          onClick={() => clearReportedAnswer(report._id)}
                        >
                          <MdDone className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        {/* <Button layout="link" size="icon" aria-label="view">
                          <AiOutlineEye
                            layout="Link"
                            className="w-5 h-5"
                            aria-hidden="true"
                            title="view"
                            href={`http://localhost:3000/pageDetails/${report?.question._id}`}
                          />
                        </Button> */}
                        <a
                          layout="link"
                          size="icon"
                          title="view"
                          target="_blank"
                          href={`http://localhost:3000/pageDetails/${report?.question_id}`}
                        >
                          <AiOutlineEye
                            className="w-5 h-5"
                            aria-hidden="true"
                            title="view"
                          />
                        </a>
                        <Button layout="link" size="icon" aria-label="Edit">
                          <AiOutlineClose
                            title="hide post"
                            className="w-5 h-5"
                            aria-hidden="true"
                          />
                        </Button>
                        {/* <Button layout="link" size="icon" aria-label="Edit">
                          <ImBlocked
                            className="w-5 h-5"
                            title="ban user"
                            aria-hidden="true"
                          />
                        </Button> */}
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
      <Modal isOpen={isreportDetailsModalOpen} onClose={closeModal}>
        <ModalBody>
          <reportDetails report={report} />
        </ModalBody>
      </Modal>
      <Modal isOpen={isSubmitModalOpen}>{modalMessage}</Modal>
    </>
  );
}

export default ReportedAnswers;
