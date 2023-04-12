import React, { useState, useEffect } from "react";

import PageTitle from "../components/Typography/PageTitle";
import { AiOutlineEye } from "react-icons/ai";
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
import { EditIcon, TrashIcon, FormsIcon } from "../icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { url } from "../utils/URL";
// import { toast } from "react-toastify";

function Messages() {
  const [page, setPage] = useState(1);
  const [totalMessage, setTotalMessage] = useState(1);
  const [messages, setMessages] = useState([]);

  function onPageChange(p) {
    setPage(p);
    getMessages();
  }

  useEffect(() => {
    getMessages();
  }, []);

  const getMessages = async () => {
    try {
      const response = await axios.get(`${url}/contacts?page=${page}`);
      console.log(response?.data);
      setMessages(response?.data?.data?.Contacts);
      setTotalMessage(response?.data?.results);
    } catch (err) {
      console.log("uer", err);
    }
  };

  const deleteAllMessages = async () => {
    try {
      const response = await axios.delete(`${url}/contacts/all`);
    } catch (err) {
      console.log("uer", err);
    }
  };

  const deleteMessage = async (id) => {
    try {
      const response = await axios.delete(`${url}/contacts/${id}`);
    } catch (err) {
      console.log("uer", err);
    }
  };

  return (
    <>
      <PageTitle>Messages</PageTitle>
      <div>
        <Button onClick={deleteAllMessages}>Delete All</Button>
      </div>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>S.N.</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Actions</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {messages.length > 0 &&
              messages.map((message, i) => (
                <>
                  <TableRow key={message._id}>
                    <TableCell>
                      <span className="text-sm">{i + 1}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{message.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{message.message}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button
                          size="icon"
                          layout="outline"
                          aria-label="Edit"
                          title="delete message"
                          onClick={() => deleteMessage(message._id)}
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
            totalResults={totalMessage}
            resultsPerPage={10}
            onChange={onPageChange}
            label="Table navigation"
          />
        </TableFooter>
      </TableContainer>
    </>
  );
}

export default Messages;
