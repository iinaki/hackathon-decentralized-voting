// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.19;

// Le metí -> Mintable, Auto Increment Ids, Enumerable, URI Storage, Ownable

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.6.0/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts@4.6.0/utils/Base64.sol";

contract Vote is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;

    // NOS GUSTARIA QUE CADA VOTO TENGA UNA IMAGEN UNICA SEGUN LOS CANDIATOS QUE ELIJA
    string[] IpfsUri = [
        "https://ipfs.io/ipfs/QmVCZ6hVENjkdCDLMoovNCR5S6bSisUQnBKPibb8XXSJqF/seed.json"
    ];

    constructor(address initialOwner)
        ERC721("Vote", "VTO")
        Ownable(initialOwner)
    {
        safeMint(msg.sender);
    }

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = tokenIdCounter.current();
        _safeMint(to, tokenId);
        updateMetaData(tokenId);
        tokenIdCounter.increment();
    }

    function updateMetaData(uint256 tokenId) public {
        // Create the SVG string
        string memory finalSVG = buildSVG();

        mapping(string => string) candidates = getCandidates();
        
        // ACTUALIZAR CON INFO DE LOS CANDIDATOS
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Voto de DVote",',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSVG)),
                        '",',
                        '"attributes": [',
                        '{"trait_type": "source",',
                        '"value": "',
                        'Sepolia',
                        '"},',
                        '{"trait_type": "price",',
                        '"value": "',
                        lastPrice.toString(),
                        '"}',
                        '{"trait_type": "vote_for_candidate_1",',
                        '"value": "',
                        candidateVote.toString(),
                        '"}',
                        "]}"
                    )
                )
            )
        );

        // Create token URI
        // uri = getCandidatesUri(candidates); //para ponerle una imagen a cada voto, segun los candidatos elegidos

        // Create token URI
        string memory finalTokenURI = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        // Set token URI
        _setTokenURI(tokenId, finalTokenURI);
    }

    // Build the SVG string
    function buildSVG() internal returns (string memory) {
        // Create SVG rectangle with random color
        string memory headSVG = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.com/svgjs' width='500' height='500' preserveAspectRatio='none' viewBox='0 0 500 500'> <rect width='100%' height='100%' fill='",
                "#0000ff",
                "' />"
            )
        );
        // Update emoji based on price
        string memory bodySVG = string(
            abi.encodePacked(
                "<text x='50%' y='50%' font-size='128' dominant-baseline='middle' text-anchor='middle'>",
                comparePrice(),
                "</text>"
            )
        );
        // Close SVG
        string memory tailSVG = "</svg>";

        // Concatenate SVG strings
        string memory _finalSVG = string(
            abi.encodePacked(headSVG, bodySVG, tailSVG)
        );
        return _finalSVG;
    }

    // The following functions are overrides required by Solidity.

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}