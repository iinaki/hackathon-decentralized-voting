// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Counters} from "@openzeppelin/contracts@4.6.0/utils/Counters.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";


contract Vote is ERC721, FunctionsClient, ConfirmedOwner {
    using Counters for Counters.Counter;
    using FunctionsRequest for FunctionsRequest.Request;

    Counters.Counter public tokenIdCounter;
    // address private oracle;
    // bytes32 private jobId;
    // uint256 private fee;

    // Hardcodeado para Sepolia
    address router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0; 

    string getSource =
        "const sha_dni = args[0];"
        "const url = 'https://dvote-api.onrender.com/users/' + sha_dni;"
        "const response = await Functions.makeHttpRequest({"
        "url: url,"
        'method: "GET"'
        "});"
        "if (response.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = response;"
        "return Functions.encodeString(data);";

    string putSource =
        "const sha_dni = args[0];"
        "const url = 'https://dvote-api.onrender.com/users/' + sha_dni;"
        "const response = await Functions.makeHttpRequest({"
        "url: url,"
        'method: "GET"'
        "});"
        "if (response.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = response;"
        "return Functions.encodeString(data);";

    uint32 gasLimit = 300000;

    // Decentralized Oracle Network ID, Hardcodeado para Sepolia
    bytes32 donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // COMPLETAR CON SUBSCRIPTION ID DE LA FUNCTION QUE CREAMOS
    uint64 subcriptionId = 1;

    mapping(string => uint256) private _presidentVotes;
    mapping(string => uint256) private _mercosurNacionalVotes;
    mapping(string => uint256) private _senadoresVotes;
    mapping(string => uint256) private _diputadosVotes;
    mapping(string => uint256) private _mercosurRegionalVotes;

    mapping(address => bool) private _hasMinted;
    mapping(bytes32 => string[]) private requestIdToCandidates;
    mapping(bytes32 => address) private requestIdToSender;
    mapping(bytes32 => string) private requestIdToHashDni;

    // Evento que se emite cuando se acuña un nuevo token
    event VoteMinted(address indexed minter, uint256 indexed tokenId, uint256 option, string president);
    event VoteRequested(bytes32 indexed requestId, address indexed voter, string hash_dni);
    event VoteFulfilled(bytes32 indexed requestId, bool isValid);
    event PutRequestSent(bytes32 indexed requestId, string hash_dni);
    event PutResponseReceived(bytes32 indexed requestId, bytes32 response);

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

    function votesAreValid(string[] memory candidates) public returns bool {
        for (uint256 i = 0; i < candidates.length; i++) {
            if (compareStrings(candidates[i], "132") ||
                compareStrings(candidates[i], "133") ||
                compareStrings(candidates[i], "134") ||
                compareStrings(candidates[i], "135") ||
                compareStrings(candidates[i], "136") ||
                compareStrings(candidates[i], "501") ||
                compareStrings(candidates[i], "502") ||
                compareStrings(candidates[i], "503") ||
                compareStrings(candidates[i], "504") ||
                compareStrings(candidates[i], "blanco")) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }

    constructor(address _oracle, bytes32 _jobId, bytes32 _postJobId, uint256 _fee, address _link) ERC721("Vote", "VTO") FunctionsClient(router) ConfirmedOwner(msg.sender) {
        initializePresidents();
        initializeMercosurNacional();
        initializeSenadores();
        initializeDiputados();
        initializeMercosurRegional();
    }

    function vote(string memory hash_dni, string[] memory candidates) public {
        require(!_hasMinted[msg.sender], "Address has already voted");

        bytes32 requestId = sendGetRequest(hash_dni)

        requestIdToCandidates[requestId] = candidates;
        requestIdToSender[requestId] = msg.sender;
        requestIdToHashDni[requestId] = hash_dni; 
    }
    
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        if (!requestIdToSender[requestId]) {
            revert UnexpectedRequestID(requestId); // Check if request IDs match
        }

        address voter = requestIdToSender[_requestId];
        string memory responseString = string(response);

        if (response.length > 0) {
            (
                uint256 _voter_id,
                string memory _sha_dni,
                bool _hasVoted,
                string memory _lugar_residencia
            ) = abi.decode(response, (uint256, string, bool, string));

            requestIdToGetResponse[_requestId] = {
                voter_id: _voter_id,
                sha_dni: _sha_dni,
                hasVoted: _hasVoted,
                lugar_residencia: _lugar_residencia
            };

            emit DecodedResponse(
                requestId,
                _voter_id,
                _sha_dni,
                _hasVoted,
                _lugar_residencia
            );
        }

        require(requestIdToGetResponse[_requestId].hasVoted, "Voter has already voted!");

        mint(requestIdToCandidates[_requestId], requestIdToGetResponse[_requestId].lugar_residencia)

        emit VoteFulfilled(_requestId, hasVoted);

        //Limpiar los mapeos después de su uso
        delete requestIdToCandidates[_requestId];
        delete requestIdToSender[_requestId];

        // Enviar solicitud PUT para indicar que el usuario ha votado
        sendPutRequest(requestIdToHashDni[_requestId]);
        //Limpiar los mapeos después de su uso
        delete requestIdToHashDni[_requestId];
        delete requestIdToGetResponse[_requestId];
    }

    function sendGetRequest(string memory hash_dni) private returns (bytes32){
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(getSource);

        string[] memory args = new string[](1);
        args[0] = hash_dni;

        req.setArgs(args);

        requestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );

        emit VoteRequested(requestId, msg.sender, hash_dni);

        return requestId;
    }

    function sendPutRequest(string memory hash_dni) private {
        Chainlink.Request memory request = buildChainlinkRequest(putJobId, address(this), this.handlePutResponse.selector);
        request.add("put", string(abi.encodePacked("https://dvote-api.onrender.com/users/", hash_dni)));
        request.add("body", "{}");  // Si necesitas enviar un cuerpo en particular, ajusta este valor

        bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);
        emit PutRequestSent(requestId, hash_dni);
    }

    function handlePutResponse(bytes32 _requestId, bytes32 response) public recordChainlinkFulfillment(_requestId) {
        emit PutResponseReceived(_requestId, response);
    }

    function mint(string[] memory candidates) private {
        require(votesAreValid(candidates) , "Invalid option in the vote");

        uint256 tokenId = tokenIdCounter.current();

        _safeMint(msg.sender, tokenId);

        _presidentVotes[candidates[0]]++;
        _mercosurNacionalVotes[candidates[1]]++;
        _senadoresVotes[candidates[2]]++;
        _diputadosVotes[candidates[3]]++;
        _mercosurRegionalVotes[candidates[4]]++;

        _hasMinted[msg.sender] = true;
        emit VoteMinted(voter, tokenId, candidates);
        tokenIdCounter.increment();
    }

    // helper function to compare strings
    function compareStrings(string memory a, string memory b)
        private pure returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}