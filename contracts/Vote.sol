// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {Counters} from "@openzeppelin/contracts@4.6.0/utils/Counters.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Vote is ERC721, ERC721URIStorage, IERC721Receiver, FunctionsClient {
    using Counters for Counters.Counter;
    using FunctionsRequest for FunctionsRequest.Request;

    struct VoterInfo {
        address addr;
        string sha_dni;
        uint256[] candidates;
        uint256 tokenId;
    }

    Counters.Counter public tokenIdCounter;

    // Hardcodeado para Sepolia
    address private immutable router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0; 
    address private i_owner;

    string[] vote_images = [
        "https://bafybeibrjh5yw6ksarmhp4zagguazs7tvfpbq3nung7b2qic7zpjxblzme.ipfs.w3s.link/voto1.jpg",
        "https://bafybeiejggcfyl3tpeynnmxm5tudem7t6dc6xqbpphg3fz4245p2oli3oa.ipfs.w3s.link/voto2.jpg",
        "https://bafybeifmj7gfkh7igq2btejha2as2wwnsjtcgh3awms7afzncwtknpnlza.ipfs.w3s.link/voto3.jpg",
        "https://bafybeibqsp2tbntqdz7uajnu6qzppbex7fc7kwjsuljmdrlrv6kj5zip2e.ipfs.w3s.link/voto4.jpg",
        "https://bafybeig2t3h3ey76mviu236uqfi5aekdc23ybsfiztw7kc2zfme2ojmcje.ipfs.w3s.link/voto5.jpg",
        "https://bafybeihykikxlgiqpw7jnxklo6rlfazsddkomct45gmqsh7ymtngspjm3m.ipfs.w3s.link/voto6.jpg",
        "https://bafybeiafa6nn7xhidotjd2qptsc72sout7ix4hmkwxo6hgxv3a2zsqsdjy.ipfs.w3s.link/voto7.jpg",
        "https://bafybeibdcn5gnqrgrmub3lnyg7yhwy7vft4jqfbj27ng34kopnctmffigq.ipfs.w3s.link/voto8.jpg"
    ];

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
        'throw Error("Failed to update voter request");'
        "}"
        "const dataPut = responsePut.data;"
        "return Functions.encodeString(JSON.stringify(dataPut.lugar_residencia));";

    uint32 private immutable gasLimit = 300000;

    // Decentralized Oracle Network ID, Hardcodeado para Sepolia
    bytes32 private immutable donID =
        0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000;

    // COMPLETAR CON SUBSCRIPTION ID DE LA FUNCTION QUE CREAMOS
    uint64 private immutable subscriptionId = 2838;

    mapping(uint256 => uint256) private _presidentVotes;
    mapping(uint256 => uint256) private _mercosurNacionalVotes;
    mapping(uint256 => uint256) private _senadoresVotes;
    mapping(uint256 => uint256) private _diputadosVotes;
    mapping(uint256 => uint256) private _mercosurRegionalVotes;

    mapping(bytes32 => VoterInfo) private voterInfo;
    mapping(string => bool) private hasVoted;

    event VoteRequested(bytes32 indexed requestId, address indexed voter, string sha_dni);
    event VoteFulfilled(bytes32 indexed requestId, address indexed voter, string sha_dni, uint256[] candidates);
    event VoteNotFulfilled(bytes32 indexed requestId, string sha_dni);

    error UnexpectedRequestID(bytes32 requestId);
    error VoterHasAlreadyVoted(string sha_dni);
    error InvalidCandidateOptions(uint256[] candidates);

    function initializePresidents() private {
        _presidentVotes[132] = 0;
        _presidentVotes[133] = 0;
        _presidentVotes[134] = 0;
        _presidentVotes[135] = 0;
        _presidentVotes[136] = 0;
        _presidentVotes[0] = 0; // voto en blanco
    }

    function initializeMercosurNacional() private {
        _mercosurNacionalVotes[132] = 0;
        _mercosurNacionalVotes[133] = 0;
        _mercosurNacionalVotes[134] = 0;
        _mercosurNacionalVotes[135] = 0;
        _mercosurNacionalVotes[136] = 0;
        _mercosurNacionalVotes[0] = 0;
    }

    function initializeSenadores() private {
        _senadoresVotes[501] = 0;
        _senadoresVotes[502] = 0;
        _senadoresVotes[503] = 0;
        _senadoresVotes[504] = 0;
        _senadoresVotes[0] = 0;
    }

    function initializeDiputados() private {
        _diputadosVotes[501] = 0;
        _diputadosVotes[502] = 0;
        _diputadosVotes[503] = 0;
        _diputadosVotes[504] = 0;
        _diputadosVotes[0] = 0;
    }

    function initializeMercosurRegional() private {
        _mercosurRegionalVotes[501] = 0;
        _mercosurRegionalVotes[502] = 0;
        _mercosurRegionalVotes[503] = 0;
        _mercosurRegionalVotes[504] = 0;
        _mercosurRegionalVotes[0] = 0;
    }

    constructor() ERC721("Vote", "VTO") FunctionsClient(router) {
        initializePresidents();
        initializeMercosurNacional();
        initializeSenadores();
        initializeDiputados();
        initializeMercosurRegional();
        i_owner = msg.sender;
    }

    function votesAreValid(uint256[] memory candidates) pure public returns (bool) {
        for (uint256 i = 0; i < candidates.length; i++) {
            if ( i < 2 && (( candidates[i] >= 132 && candidates[i] <= 136 ) || candidates[i] == 0 )) {
                continue;
            } else if (i >= 2 && (( candidates[i] >= 501 && candidates[i] <= 504 ) || candidates[i] == 0 )) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    }
    
    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        VoterInfo memory voter = voterInfo[requestId];
        if (voter.addr == address(0)) {
            revert UnexpectedRequestID(requestId);
        }

        if (err.length > 0) {
            _burn(voter.tokenId);
        } else {
            _presidentVotes[voter.candidates[0]]++;
            _mercosurNacionalVotes[voter.candidates[1]]++;
            _senadoresVotes[voter.candidates[2]]++;
            _diputadosVotes[voter.candidates[3]]++;
            _mercosurRegionalVotes[voter.candidates[4]]++;

            hasVoted[voter.sha_dni] = true;
        }

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

    function mint(address voter, string memory voteURI) private returns (uint256) {
        uint256 tokenId = tokenIdCounter.current();

        _safeMint(voter, tokenId, "");
        _setTokenURI(tokenId, voteURI);

        tokenIdCounter.increment();

        return tokenId;
    }

    function setImage() view  private returns (string memory image){
        uint256 tokenId = tokenIdCounter.current();
        uint256 index = tokenId % 8;
        return vote_images[index];
    }

    function createVoteURI(string memory sha_dni) view private returns (string memory) {
        string memory image_candidate = setImage();

        string memory uri = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Voto de Elecciones Presidenciales Argentina 2023 - 1ra Vuelta",'
                        '"description": "Esto es valido como constancia de voto en las Elecciones Presidenciales de Argentina realizadas en 2023 - 1ra Vuelta, minteado por el ciudadano con clave encriptada ', sha_dni, '",',
                        '"image": "', image_candidate, '"'
                        '}'
                    )
                )
            )
        );
      
        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", uri)
        );

        return finalTokenURI;
    }

    function vote(
        string memory sha_dni,
        uint256[] memory candidates
    ) public {
        if (hasVoted[sha_dni]) {
            revert VoterHasAlreadyVoted(sha_dni);
        }
        if (!votesAreValid(candidates)) {
            revert InvalidCandidateOptions(candidates);
        }

        string memory voteURI = createVoteURI(sha_dni);
        uint256 tokenId = mint(msg.sender, voteURI);

        bytes32 requestId = sendRequest(sha_dni);

        voterInfo[requestId] = VoterInfo({
            addr: msg.sender,
            sha_dni: sha_dni,
            candidates: candidates,
            tokenId: tokenId
        });
    }

    function getPresidentVotes(uint256 option) public view returns (uint256) {
        return _presidentVotes[option];
    }
    function getMercosurNacionalVotes(uint256 option) public view returns (uint256) {
        return _mercosurNacionalVotes[option];
    }
    function getSenadoresVotes(uint256 option) public view returns (uint256) {
        return _senadoresVotes[option];
    }
    function getDiputadosVotes(uint256 option) public view returns (uint256) {
        return _diputadosVotes[option];
    }
    function getMercosurRegionalVotes(uint256 option) public view returns (uint256) {
        return _mercosurRegionalVotes[option];
    }

    function userHasVoted(string memory sha_dni) public view returns (bool) {
        return hasVoted[sha_dni];
    }

    function tokenURI(uint256 tokenId)
        public view override(ERC721, ERC721URIStorage) returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function onERC721Received(address , address , uint256 , bytes calldata ) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }
}