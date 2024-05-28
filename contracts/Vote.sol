// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts@4.6.0/utils/Counters.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";


contract Vote is ERC721, FunctionsClient, ConfirmedOwner {
    using Counters for Counters.Counter;
    using FunctionsRequest for FunctionsRequest.Request;

    struct VoterInfo {
        address addr;
        string sha_dni;
        bool hasVoted;
        string lugar_residencia;
        string[] candidates;
    }

    Counters.Counter public tokenIdCounter;

    // Hardcodeado para Sepolia
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0; 

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
        "const responsePut = await Functions.makeHttpRequest({"
        "url: url,"
        'method: "PUT"'
        "});"
        "if (responsePut.error) {"
        'return Functions.encodeString("bsas");'
        "}"
        "const dataPut = responsePut.data;"
        "return Functions.encodeString(JSON.stringify(dataPut.lugar_residencia));";

    uint32 gasLimit = 300000;

    // Decentralized Oracle Network ID, Hardcodeado para Sepolia
    bytes32 donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // COMPLETAR CON SUBSCRIPTION ID DE LA FUNCTION QUE CREAMOS
    uint64 subscriptionId = 2838;

    mapping(string => uint256) private _presidentVotes;
    mapping(string => uint256) private _mercosurNacionalVotes;
    mapping(string => uint256) private _senadoresVotes;
    mapping(string => uint256) private _diputadosVotes;
    mapping(string => uint256) private _mercosurRegionalVotes;

    mapping(bytes32 => VoterInfo) public voterInfo;

    event VoteRequested(bytes32 indexed requestId, address indexed voter, string hash_dni);
    event VoteMinted(uint256 tokenId, address indexed voter, string[] candidates);
    event VoteFulfilled(bytes32 indexed requestId, address indexed voter, string hash_dni);
    event DecodedResponse(bytes32 indexed requestId, string sha_dni, bool hasVoted, string lugar_residencia);

    error UnexpectedRequestID(bytes32 requestId);
    error VoterHasAlreadyVoted(string sha_dni);
    error AddressHasAlreadyVoted(address voter);

    function initializePresidents() private {
        _presidentVotes["132"] = 0;
        _presidentVotes["133"] = 0;
        _presidentVotes["134"] = 0;
        _presidentVotes["135"] = 0;
        _presidentVotes["136"] = 0;
        _presidentVotes["blanco"] = 0;
    }

    function initializeMercosurNacional() private {
        _mercosurNacionalVotes["132"] = 0;
        _mercosurNacionalVotes["133"] = 0;
        _mercosurNacionalVotes["134"] = 0;
        _mercosurNacionalVotes["135"] = 0;
        _mercosurNacionalVotes["136"] = 0;
        _mercosurNacionalVotes["blanco"] = 0;
    }

    function initializeSenadores() private {
        _senadoresVotes["501"] = 0;
        _senadoresVotes["502"] = 0;
        _senadoresVotes["503"] = 0;
        _senadoresVotes["504"] = 0;
        _senadoresVotes["blanco"] = 0;
    }

    function initializeDiputados() private {
        _diputadosVotes["501"] = 0;
        _diputadosVotes["502"] = 0;
        _diputadosVotes["503"] = 0;
        _diputadosVotes["504"] = 0;
        _diputadosVotes["blanco"] = 0;
    }

    function initializeMercosurRegional() private {
        _mercosurRegionalVotes["501"] = 0;
        _mercosurRegionalVotes["502"] = 0;
        _mercosurRegionalVotes["503"] = 0;
        _mercosurRegionalVotes["504"] = 0;
        _mercosurRegionalVotes["blanco"] = 0;
    }

    function votesAreValid(string[] memory candidates) pure  public returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if ( i < 2 && (compareStrings(candidates[i], "132") ||
                compareStrings(candidates[i], "133") ||
                compareStrings(candidates[i], "134") ||
                compareStrings(candidates[i], "135") ||
                compareStrings(candidates[i], "136") ||
                compareStrings(candidates[i], "blanco"))) {
                continue;
            } else if (i >= 2 && (compareStrings(candidates[i], "501") ||
                compareStrings(candidates[i], "502") ||
                compareStrings(candidates[i], "503") ||
                compareStrings(candidates[i], "504") ||
                compareStrings(candidates[i], "blanco")))
                continue;
            else {
                return false;
            }
        }
        return true;
    }

    constructor() ERC721("Vote", "VTO") FunctionsClient(router) ConfirmedOwner(msg.sender) {
        initializePresidents();
        initializeMercosurNacional();
        initializeSenadores();
        initializeDiputados();
        initializeMercosurRegional();
    }

    function vote(string memory sha_dni, string[] memory candidates) public {
        bytes32 requestId = sendRequest(sha_dni);

        voterInfo[requestId].candidates = candidates;
        voterInfo[requestId].addr = msg.sender;
        voterInfo[requestId].sha_dni = sha_dni; 

        emit VoteRequested(requestId, msg.sender, sha_dni);
    }
    
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (err.length > 0) {
            revert("Error in request");
        }

        if (voterInfo[requestId].addr == address(0)) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }

        string memory lugar_residencia = string(response);

        voterInfo[requestId].lugar_residencia = lugar_residencia;

        emit DecodedResponse(
            requestId,
            voterInfo[requestId].sha_dni,
            true,
            lugar_residencia
        );

        mint(voterInfo[requestId].candidates, lugar_residencia, voterInfo[requestId].addr);

        emit VoteFulfilled(requestId, voterInfo[requestId].addr, voterInfo[requestId].sha_dni);

        delete voterInfo[requestId];
    }

    function sendRequest(string memory hash_dni) private returns (bytes32){
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(source);

        string[] memory args = new string[](1);
        args[0] = hash_dni;

        req.setArgs(args);

        bytes32 requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        emit VoteRequested(requestId, msg.sender, hash_dni);

        return requestId;
    }

    function mint(string[] memory candidates, string memory lugar_residencia, address voter) private {
        require(votesAreValid(candidates) , "Invalid option in the vote");

        uint256 tokenId = tokenIdCounter.current();

        _safeMint(voter, tokenId);

        _presidentVotes[candidates[0]]++;
        _mercosurNacionalVotes[candidates[1]]++;
        _senadoresVotes[candidates[2]]++;
        _diputadosVotes[candidates[3]]++;
        _mercosurRegionalVotes[candidates[4]]++;

        emit VoteMinted(tokenId, voter, candidates);
        tokenIdCounter.increment();
    }

    // helper function to compare strings
    function compareStrings(string memory a, string memory b)
        private pure returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }

    function getPresidentVotes(string memory option) public view returns (uint256) {
        return _presidentVotes[option];
    }
    function getMercosurNacionalVotes(string memory option) public view returns (uint256) {
        return _mercosurNacionalVotes[option];
    }
    function getSenadoresVotes(string memory option) public view returns (uint256) {
        return _senadoresVotes[option];
    }
    function getDiputadosVotes(string memory option) public view returns (uint256) {
        return _diputadosVotes[option];
    }
    function getMercosurRegionalVotes(string memory option) public view returns (uint256) {
        return _mercosurRegionalVotes[option];
    }

}