// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Counters} from "@openzeppelin/contracts@4.6.0/utils/Counters.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/v1_0_0/libraries/FunctionsRequest.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract Vote is ERC721, ERC721URIStorage, FunctionsClient, ConfirmedOwner {
    using Counters for Counters.Counter;
    using FunctionsRequest for FunctionsRequest.Request;

    struct VoterInfo {
        address addr;
        string sha_dni;
        uint256[] candidates;
        string voteURI;
    }

    Counters.Counter public tokenIdCounter;

    // Hardcodeado para Sepolia
    address private immutable router = 0xb83E47C2bC239B3bf370bc41e1459A34b41238D0; 
    address private immutable i_owner;

    string[] vote_images = [
        "https://bafybeif7boczaiaexk7h3gkhaxdxtz5azbmn2fvmnublrwu2q7vlungnsm.ipfs.w3s.link/132.jpg",
        "https://bafybeigxgttb3u6zd6j24k4z4j74huifcm6lqm6i4sxbggaqlmqazgc65i.ipfs.w3s.link/133.jpg",
        "https://bafybeihswysyxyj6verw4chrq34y54baitck2p6357q3cza6g6zbjtr3ei.ipfs.w3s.link/134.jpg",
        "https://bafybeifm4r7atpobxxeymucpvq6pppxaou3emha6thgdvkgbhr3xyibqp4.ipfs.w3s.link/135.jpg",
        "https://bafybeidvjiqwlwy6lhqwlulpcxps423nnxerr2dq7ojbf3vgnihjoef2em.ipfs.w3s.link/136.jpg"
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
    event VoteMinted(uint256 tokenId, address indexed voter, uint256[] candidates);
    event VoteFulfilled(bytes32 indexed requestId, address indexed voter, string sha_dni);
    event VoteNotFulfilled(bytes32 indexed requestId, string sha_dni);
    event DecodedResponse(bytes32 indexed requestId, string sha_dni, bool hasVoted, string lugar_residencia);

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

    constructor() ERC721("Vote", "VTO") FunctionsClient(router) ConfirmedOwner(msg.sender) {
        initializePresidents();
        initializeMercosurNacional();
        initializeSenadores();
        initializeDiputados();
        initializeMercosurRegional();
        i_owner = msg.sender;
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

        mint(voterInfo[requestId].candidates, voterInfo[requestId].addr, voterInfo[requestId].voteURI, lugar_residencia);

        hasVoted[voterInfo[requestId].sha_dni] = true;

        emit VoteFulfilled(requestId, voterInfo[requestId].addr, voterInfo[requestId].sha_dni);

        delete voterInfo[requestId]; 
    }

    function setImage(uint256 president) view  private returns (string memory image) {
        if (president == 132) {
            return vote_images[0];
        } else if (president == 133) {
            return vote_images[1];
        } else if (president == 134) {
            return vote_images[2];
        } else if (president == 135) {
            return vote_images[3];
        } else {
            return vote_images[4];
        }
    }

    function mint(uint256[] memory candidates, address voter, string memory voteURI, string memory lugar_residencia) private {
        uint256 tokenId = tokenIdCounter.current();

        _safeMint(voter, tokenId);
        _setTokenURI(tokenId, voteURI);

        _presidentVotes[candidates[0]]++;
        _mercosurNacionalVotes[candidates[1]]++;
        _senadoresVotes[candidates[2]]++;
        _diputadosVotes[candidates[3]]++;
        _mercosurRegionalVotes[candidates[4]]++;

        emit VoteMinted(tokenId, voter, candidates);
        tokenIdCounter.increment();
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

    function createVoteURI(uint256[] memory candidates) view private returns (string memory) {
        string memory image = setImage(candidates[0]);

        string memory uri = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Voto de Elecciones Presidenciales Argentina 2023 - 1ra Vuelta",'
                        '"description": "Este es un voto de Elecciones Presidenciales de Argentina realizadas en 2023",',
                        '"image": "', image, '",'
                        '"attributes": [',
                            '{"trait_type": "Voto de Presidente",',
                            '"value": ', Strings.toString(candidates[0]),'}',
                            ',{"trait_type": "Voto de Mercosur Nacional",',
                            '"value": ', Strings.toString(candidates[1]),'}',
                            ',{"trait_type": "Voto de Senadores",',
                            '"value": ', Strings.toString(candidates[2]),'}',
                            ',{"trait_type": "Voto de Diptados",',
                            '"value": ', Strings.toString(candidates[3]),'}',
                            ',{"trait_type": "Voto de Mercosur Regional",',
                            '"value": ', Strings.toString(candidates[4]),'}'
                        ']}'
                    )
                )
            )
        );
        
        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", uri)
        );

        return finalTokenURI;
    }

    function vote(string memory sha_dni, uint256[] memory candidates) public {
        if (!votesAreValid(candidates)){
            revert InvalidCandidateOptions(candidates);
        }

        if (hasVoted[sha_dni]){
            revert VoterHasAlreadyVoted(sha_dni);
        }

        string memory voteURI = createVoteURI(candidates);

        bytes32 requestId = sendRequest(sha_dni);

        voterInfo[requestId].candidates = candidates;
        voterInfo[requestId].addr = msg.sender;
        voterInfo[requestId].sha_dni = sha_dni; 
        voterInfo[requestId].voteURI = voteURI;
    }

    // helper function to compare strings
    function compareStrings(string memory a, string memory b)
        private pure returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
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
}