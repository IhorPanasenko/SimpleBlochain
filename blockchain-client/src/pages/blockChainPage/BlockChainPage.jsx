import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BlockChainPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltUp } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

const GET_CHAIN = "http://127.0.0.1:5000/get_chain";
const MINE_BLOCK = "http://127.0.0.1:5000/mine_block";
const VALID_CHAIN = "http://127.0.0.1:5000/valid";
const EDIT_BLOCK = "http://127.0.0.1:5000/change_data";
const DELETE_INVALID_BLOCKS = "http://127.0.0.1:5000/clean_chain";

function BlockChainPage() {
  const [blockchain, setBlockchain] = useState([]);
  const [length, setLength] = useState(0);
  const [newData, setNewData] = useState("Test Data");
  const [showFormCreate, setShowFormCreate] = useState(false);
  const [editedData, setEditedData] = useState("Edited Data");
  const [editingIndex, setEditingIndex] = useState(1);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [isChainValid, setIsChainValid] = useState(true);

  const handleGetChain = () => {
    axios
      .get(GET_CHAIN)
      .then((response) => {
        setBlockchain(response.data.chain);
        setLength(response.data.length);
      })
      .catch((error) => {
        console.error("Error fetching blockchain data:", error);
      });
  };

  const handleMineBlock = () => {
    setShowFormCreate(!showFormCreate);
  };

  const handleSubmit = () => {
    setShowFormCreate(false);

    const body = {
      data: newData,
    };

    axios
      .post(MINE_BLOCK, body)
      .then((response) => {
        handleGetChain();
        console.log(response);
        alert("Block successfully mined\nBlock index:\t" + response.data.index);
      })
      .catch((error) => {
        console.error("Error mining a block:", error);
        alert("Some error happened, try again later");
      });

      setNewData("");
  };

  const handleValidChain = () => {
    axios
      .get(VALID_CHAIN)
      .then((response) => {
        console.log(response);
        alert(response.data.message + "\t"+response.data.result);
        setIsChainValid(response.data.result);
      })
      .catch((error) => {
        console.error("Error validating the chain:", error);
        alert("Error in validing chain");
      });
  };


  const handleEditBlock = () => {
    setShowFormEdit(!showFormEdit)
  };
  
  const handleEditingSubmit = () => {
    setShowFormEdit(false);
    const body = {
      block_index: (editingIndex-1),
      new_data: editedData,
    };

    axios
      .post(EDIT_BLOCK, body)
      .then((response) => {
        handleGetChain();
        console.log(response);
        alert("Block edited successfully");
      })
      .catch((error) => {
        console.error("Error editing a block:", error);
        alert("Some error happened, try again later");
      });

    setEditedData("");
  };

  const handleDeleteInvalidBlocks = () => {
    axios
    .post(DELETE_INVALID_BLOCKS)
    .then((response) => {
      handleGetChain();
      console.log(response);
      alert("Invalid blocks have been deleted");
    })
    .catch((error) => {
      console.error("Error deleting invalid blocks:", error);
      alert("Some error happened, try again later");
    });
  };

  return (
    <div className="container text-center mt-4">
      <h2 className="mb-4">Representation of Simple Blockchain</h2>
      <div className="row justify-content-center">
        <div className="col-md-6 mb-2">
          <button
            className="btn btn-primary m-2 p-5 pt-3 pb-3"
            onClick={handleGetChain}
          >
            Get Chain
          </button>
          <button
            className="btn btn-success m-2 p-5 pt-3 pb-3"
            onClick={handleMineBlock}
          >
            Mine Block
          </button>
          <button
            className="btn btn-info m-2 p-5 pt-3 pb-3"
            onClick={handleValidChain}
          >
            Valid Chain
          </button>
          <button
            className="btn btn-danger m-2 p-5 pt-3 pb-3"
            onClick={handleEditBlock}
          >
            Edit Block
          </button>
          {!isChainValid &&
          (
            <button
              className="btn btn-danger m-2 p-5 pt-3 pb-3"
              onClick={handleDeleteInvalidBlocks}
            >
              Delete invalid blocks
            </button>
          )}
        </div>
      </div>
      <div className="text-start bg-success m-5 mt-2 mb-2 p-3 rounded border border-4 border-info">
        <h4>Current chain length: {length}</h4>
      </div>
      {showFormCreate && (
        <div className="row justify-content-center bg-light m-3 p-2 border border-3 border-info rounded ">
          <div className="col-md-6 text-start">
            <form>
              <div className="mb-3">
                <label htmlFor="newBlockData" className="form-label">
                  New block data
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="newBlockData"
                  value={newData}
                  onChange={(e) => setNewData(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary p-5 pt-3 pb-3"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {showFormEdit && (
        <div className="row justify-content-center bg-light m-3 p-2 border border-3 border-info rounded ">
          <div className="col-md-6 text-start">
            <form>
              <div className="mb-3">
                <label htmlFor="newBlockData" className="form-label">
                  Block index
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="newBlockData"
                  value={editingIndex}
                  onChange={(e) => {
                    if (parseInt(e.target.value) > blockchain.length) {
                      alert(
                        "Invalid index. It can't be greater than number of blocks"
                      );
                      return;
                    }

                    setEditingIndex(parseInt(e.target.value));
                  }}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="newBlockData" className="form-label">
                  Edited data
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="newBlockData"
                  value={editedData}
                  onChange={(e) => setEditedData(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary p-5 pt-3 pb-3"
                onClick={handleEditingSubmit}
              >
                Edit block
              </button>
            </form>
          </div>
        </div>
      )}
      <div className="mt-4 mb-3">
        <h3>BLOCKCHAIN</h3>
      </div>
      <div className="chain row justify-content-center">
        {blockchain
          .slice()
          .reverse()
          .map((block, index) => (
            <div key={index} className="block col-md-6 ">
              {index <= length - 1 && index !== 0 && (
                <div className="arrow text-center mb-2">
                  <FontAwesomeIcon
                    icon={faLongArrowAltUp}
                    style={{ fontSize: "3em", color: "lightblue" }}
                  />
                </div>
              )}
              <div className="card mb-4 bg-warning">
                <div className="card-body">
                  <h5 className="card-title">Block {block.index}</h5>
                  <table className="table table-bordered border solid border-2 border-info">
                    <thead className="">
                      <tr className="">
                        <th>Attribute</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Index</td>
                        <td>{block.index}</td>
                      </tr>
                      <tr>
                        <td>Data</td>
                        <td>{block.data}</td>
                      </tr>
                      <tr>
                        <td>Previous Hash</td>
                        <td
                          className="text-truncate"
                          style={{ maxWidth: "150px" }}
                        >
                          {block.previous_hash}
                        </td>
                      </tr>
                      <tr>
                        <td>Proof</td>
                        <td>{block.proof}</td>
                      </tr>
                      <tr>
                        <td>Timestamp</td>
                        <td>{block.timestamp}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BlockChainPage;
