import React, { useState, useEffect } from "react";

import PageTitle from "../../components/Typography/PageTitle";

import { EditIcon, TrashIcon, FormsIcon } from "../../icons";
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

function Exchange() {
  const [Exchanges, setExchanges] = useState([]);

  useEffect(() => {
    getExchange();
  }, []);

  const getExchange = async () => {
    try {
      const response = await axios.get(`${url}/exchange`);
      console.log("exc", response.data.data.Exchanges);
      setExchanges(response?.data?.data?.Exchanges);
    } catch (err) {
      console.log("uer", err);
    }
  };

  if (Exchanges.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="pt-20">No Exchanges Yet</p>
      </div>
    );
  }

  return (
    <>
      <PageTitle>Exchange</PageTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>User</TableCell>
              <TableCell>Gift Name</TableCell>
              <TableCell>Gift Price</TableCell>
              <TableCell>Exchanged Date</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {Exchanges &&
              Exchanges.length > 0 &&
              Exchanges.map((exchange, i) => (
                <>
                  <TableRow key={exchange._id}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Avatar
                          className="hidden mr-3 md:block"
                          src={`http://localhost:5000/static/users/${exchange?.user_id.user_image}`}
                          alt="exchange avatar"
                        />
                        <div>
                          <p className="font-semibold">
                            {exchange?.user_id?.full_name || "User"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className=" overflow-hidden">
                      <span className="text-sm">
                        {exchange?.gift?.gift_name || "gift"}
                      </span>
                    </TableCell>
                    <TableCell className=" overflow-hidden">
                      <span className="text-sm">
                        {exchange?.gift?.gift_price || 0}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(exchange.createdAt).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                </>
              ))}
          </TableBody>
        </Table>
        <TableFooter></TableFooter>
      </TableContainer>
    </>
  );
}

export default Exchange;
