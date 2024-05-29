// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";

interface VoteInterface {
    function vote(address voter_address, string memory sha_dni, string[] memory candidates) external;
}

contract VoteChecker is FunctionsClient, ConfirmedOwner {
    using FunctionsRequest for FunctionsRequest.Request;

    struct VoterInfo {
        address addr;
        string sha_dni;
        bool hasVoted;
        string[] candidates;
    }

    // Hardcodeado para Sepolia
    address private immutable router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0; 
    address private vote_address;
    address private immutable i_owner;

    string source =
        "const sha_dni = args[0];"
        "const url = 'https://dvote-api.onrender.com/users/' + sha_dni;"
        "const responseGet = await Functions.makeHttpRequest({"
        "url: url,"
        'method: "GET"'
        "});"
        "if (responseGet.error) {"
        'throw Error("Failed to get voter request");'
        "}"
        "const dataGet = responseGet.data;"
        "return Functions.encodeUint256(dataGet.voto ? 1:0);";

    uint32 private immutable gasLimit = 300000;

    // Decentralized Oracle Network ID, Hardcodeado para Sepolia
    bytes32 private immutable donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // COMPLETAR CON SUBSCRIPTION ID DE LA FUNCTION QUE CREAMOS
    uint64 private immutable subscriptionId = 2838;

    mapping(bytes32 => VoterInfo) public voterInfo;

    event VoteCheckRequested(bytes32 indexed requestId, address indexed voter, string sha_dni);
    event VoteCheckFulfilled(bytes32 indexed requestId, address indexed voter, string sha_dni);
    event VoterHasAlreadyVoted(bytes32 indexed requestId, string sha_dni);
    event VoteCallSuccessfull();

    error UnexpectedRequestID(bytes32 requestId);
    error NotOwner();

    constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) {
        i_owner = msg.sender;
    }
    
    function votes_are_valid(string[] memory candidates) pure  public returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if ( i < 2 && (compare_strings(candidates[i], "132") ||
                compare_strings(candidates[i], "133") ||
                compare_strings(candidates[i], "134") ||
                compare_strings(candidates[i], "135") ||
                compare_strings(candidates[i], "136") ||
                compare_strings(candidates[i], "blanco"))) {
                continue;
            } else if (i >= 2 && (compare_strings(candidates[i], "501") ||
                compare_strings(candidates[i], "502") ||
                compare_strings(candidates[i], "503") ||
                compare_strings(candidates[i], "504") ||
                compare_strings(candidates[i], "blanco")))
                continue;
            else {
                return false;
            }
        }
        return true;
    }

    function update_vote_address(address new_vote_address) public {
        if(msg.sender != i_owner){
            revert NotOwner();
        }

        vote_address = new_vote_address;
    }

    function request_vote(bytes32 requestId) internal {
        VoteInterface voteContract = VoteInterface(vote_address);
        // voteContract.vote(
        //     voterInfo[requestId].addr,
        //     voterInfo[requestId].sha_dni,
        //     voterInfo[requestId].candidates
        // );
        bytes memory message;
        message = abi.encodeWithSignature("vote(address,string memory,string[] memory)", voterInfo[requestId].addr, voterInfo[requestId].sha_dni, voterInfo[requestId].candidates);

        (bool success, ) = address(voteContract).call(message);
        require(success, "Vote Call was NOT Successfull");
        emit VoteCallSuccessfull();
    }

    
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            delete voterInfo[requestId];
            revert ("Error in request");
        }

        if (voterInfo[requestId].addr == address(0)) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }

        uint256 user_already_voted = abi.decode(response, (uint256));

        if (user_already_voted == 1) {
            string memory sha_dni = voterInfo[requestId].sha_dni;
            delete voterInfo[requestId];

            emit VoterHasAlreadyVoted(requestId, sha_dni);

            revert(string(abi.encodePacked("User already voted ", sha_dni)));
        }else{
            request_vote(requestId);

            emit VoteCheckFulfilled(requestId, voterInfo[requestId].addr, voterInfo[requestId].sha_dni);

            delete voterInfo[requestId];
        }   
    }

    function sendRequest(string memory sha_dni) private returns (bytes32){
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        string[] memory args = new string[](1);
        args[0] = sha_dni;

        req.setArgs(args);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        return requestId;
    }

    function vote_check(string memory sha_dni, string[] memory candidates) public {
        require(votes_are_valid(candidates), "votes are invalid options");

        bytes32 requestId = sendRequest(sha_dni);

        voterInfo[requestId].candidates = candidates;
        voterInfo[requestId].addr = msg.sender;
        voterInfo[requestId].sha_dni = sha_dni; 

        emit VoteCheckRequested(requestId, msg.sender, sha_dni);
    }

    function compare_strings(string memory a, string memory b)
        private pure returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}