import React, { useState, useEffect } from "react";

import PageTitle from "./../../components/Typography/PageTitle";
import SectionTitle from "./../../components/Typography/SectionTitle";
import { AiOutlineEye } from "react-icons/ai";

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
import { EditIcon, FormsIcon, TrashIcon } from "./../../icons";
import axios from "axios";
import { url } from "./../../utils/URL";
import UpdateRewards from "./UpdateRewards.js";
// import { toast } from "react-toastify";

function Rewards() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rewards, setRewards] = useState([]);
  const [indReward, setReward] = useState({ rewardType: "", value: 0, id: 0 });
  const [isRewarsModalOpen, setRewardsModalOpen] = useState(false);

  function onPageChange(p) {
    setPage(p);
  }

  useEffect(() => {
    getRewards();
  }, []);

  const closeModal = () => {
    setRewardsModalOpen(false);
  };

  const getRewards = async () => {
    setRewardsModalOpen(false);
    try {
      const response = await axios.get(`${url}/rewards`);
      setRewards(response?.data?.data?.Rewards);
      setTotalPages(response?.data?.data?.totalPages);
    } catch (err) {
      console.log("uer", err);
    }
  };

  console.log("updated", rewards[0]?.updated_by?.full_name);

  return (
    <>
      {rewards && (
        <div>
          <PageTitle>Rewards Table</PageTitle>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>S.N.</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Value</TableCell>
                  <TableCell>Updated By</TableCell>
                  <TableCell>Created Date</TableCell>
                  <TableCell>Actions</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {rewards.length > 0 &&
                  rewards.map((reward, i) => (
                    <>
                      <TableRow key={reward._id}>
                        <TableCell>
                          <span className="text-sm">{i + 1}</span>
                        </TableCell>
                        <TableCell>
                          <p className="font-semibold">{reward.type}</p>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">{reward.value}</span>
                        </TableCell>
                        <TableCell>
                          <Badge type={reward.status}>
                            {reward?.updated_by?.full_name}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {new Date(reward.createdAt).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-4">
                            <Button
                              layout="link"
                              size="icon"
                              aria-label="view"
                              onClick={() => {
                                setReward({
                                  type: reward.type,
                                  value: reward.value,
                                  id: reward._id,
                                });
                                setRewardsModalOpen(true);
                              }}
                            >
                              <EditIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
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
          <Modal isOpen={isRewarsModalOpen} onClose={closeModal}>
            <UpdateRewards
              get={getRewards}
              rewardValue={indReward.value}
              rewardType={indReward.type}
              id={indReward.id}
            />
          </Modal>
        </div>
      )}
      {!rewards && <p>Couldnot get data</p>}
    </>
  );
}

export default Rewards;
