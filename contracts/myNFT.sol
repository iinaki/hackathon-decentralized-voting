// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.6.0/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/interfaces/ChainlinkRequestInterface.sol";

contract Vote is ERC721, ChainlinkClient {
    using Counters for Counters.Counter;
    using Chainlink for Chainlink.Request;

    Counters.Counter public tokenIdCounter;
    address private oracle;
    bytes32 private jobId;
    uint256 private fee;

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
    event PostRequestSent(bytes32 indexed requestId, string hash_dni);
    event PostResponseReceived(bytes32 indexed requestId, bytes32 response);

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

    constructor(address _oracle, bytes32 _jobId, bytes32 _postJobId, uint256 _fee, address _link) ERC721("Vote", "VTO") {
        setChainlinkToken(_link);
        oracle = _oracle;
        jobId = _jobId;
        postJobId = _postJobId;
        fee = _fee;
        
        initializePresidents();
        initializeMercosurNacional();
        initializeSenadores();
        initializeDiputados();
        initializeMercosurRegional();
    }

    function vote(string memory hash_dni, string[] memory candidates) public {
        require(!_hasMinted[msg.sender], "Address has already voted");

        Chainlink.Request memory request = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        request.add("get", string(abi.encodePacked("https://dvote-api.onrender.com/users/", hash_dni)));
        request.add("path", "hasVoted");

        bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);
        requestIdToCandidates[requestId] = candidates;
        requestIdToSender[requestId] = msg.sender;
        requestIdToHashDni[requestId] = hash_dni;

        emit VoteRequested(requestId, msg.sender, hash_dni);
    }

    function fulfill(bytes32 _requestId, bool hasVoted) public recordChainlinkFulfillment(_requestId) {
        address voter = requestIdToSender[_requestId];
        require(voter != address(0), "Voter address is invalid");
        require(hasVoted, "Voter has already voted!");

        mint(requestIdToCandidates[_requestId])

        emit VoteFulfilled(_requestId, hasVoted);

        // Limpiar los mapeos después de su uso
        delete requestIdToCandidates[_requestId];
        delete requestIdToSender[_requestId];

        // Enviar solicitud POST para indicar que el usuario ha votado
        sendPostRequest(requestIdToHashDni[_requestId]);
        delete requestIdToHashDni[_requestId];
    }

    function sendPostRequest(string memory hash_dni) private {
        Chainlink.Request memory request = buildChainlinkRequest(postJobId, address(this), this.handlePostResponse.selector);
        request.add("post", string(abi.encodePacked("https://dvote-api.onrender.com/users/", hash_dni)));
        request.add("body", "{}");  // Si necesitas enviar un cuerpo en particular, ajusta este valor

        bytes32 requestId = sendChainlinkRequestTo(oracle, request, fee);
        emit PostRequestSent(requestId, hash_dni);
    }

    function handlePostResponse(bytes32 _requestId, bytes32) public recordChainlinkFulfillment(_requestId) {
        emit PostResponseReceived(_requestId, data);
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

    function mint(string[] memory candidates) private {
        require(votesAreValid(candidates) , "Invalid option in the vote");

        uint256 tokenId = tokenIdCounter.current();

        _safeMint(msg.sender, tokenId);

        _presidentVotes[president[0]]++;
        _mercosurNacionalVotes[president[1]]++;
        _senadoresVotes[president[2]]++;
        _diputadosVotes[president[3]]++;
        _mercosurRegionalVotes[president[4]]++;

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