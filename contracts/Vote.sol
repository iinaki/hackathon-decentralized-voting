// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

// Le metí -> Mintable, Auto Increment Ids, Enumerable, URI Storage, Ownable

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vote is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter public tokenIdCounter;

    // NOS GUSTARIA QUE CADA VOTO TENGA UNA IMAGEN UNICA SEGUN LOS CANDIATOS QUE ELIJA
    string[] IpfsUri = [
        "https://ipfs.io/ipfs/QmVCZ6hVENjkdCDLMoovNCR5S6bSisUQnBKPibb8XXSJqF/seed.json",
        "https://ipfs.io/ipfs/QmVCZ6hVENjkdCDLMoovNCR5S6bSisUQnBKPibb8XXSJqF/purple-sprout.json",
        "https://ipfs.io/ipfs/QmVCZ6hVENjkdCDLMoovNCR5S6bSisUQnBKPibb8XXSJqF/purple-blooms.json"
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
        updateMetaData(tokenId, candidates, uri);
        tokenIdCounter.increment();
    }

    function updateMetaData(uint256 tokenId) public {
        // Create the SVG string
        string memory finalSVG = buildSVG(sourceId);

        mapping(string => string) candidates = getCandidates();
        
        // ACTUALIZAR CON INFO DE LOS CANDIDATOS
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Voto de la Votación Descentralizada",',
                        '"description": "",',
                        '"image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSVG)),
                        '",',
                        '"attributes": [',
                        '{"trait_type": "source",',
                        '"value": "',
                        chain[sourceId].name,
                        '"},',
                        '{"trait_type": "price",',
                        '"value": "',
                        lastPrice.toString(),
                        '"}',
                        "]}"
                    )
                )
            )
        );

        // Create token URI
        uri = getCandidatesUri(candidates); //para ponerle una imagen a cada voto, segun los candidatos elegidos
        // Set token URI
        _setTokenURI(tokenId, uri);
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