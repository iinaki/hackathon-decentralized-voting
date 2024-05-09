// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MyNFT is ERC721 {
    uint256 private _tokenIdCounter;
    mapping(uint256 => uint256) private _tokenOptions;
    mapping(uint256 => string) private _presidentVote;

    mapping(uint256 => uint256) private _tokensVoted;
    mapping(string => uint256) private _presidentVotes;
    mapping(address => bool) private _hasMinted;

    // Evento que se emite cuando se acuña un nuevo token
    event OptionMinted(address indexed minter, uint256 indexed tokenId, uint256 option, string president);

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        _tokenIdCounter = 0;
    }

    function mint(uint256 option, string memory president) external {
        require(option == 1 || option == 2, "Invalid option");
        require(compareStrings(president, "Milei") ||compareStrings(president, "Massa"), "Invalid option");
        require(!_hasMinted[msg.sender], "Address has already minted");

        _tokenIdCounter++;
        uint256 newTokenId = _tokenIdCounter;
        _safeMint(msg.sender, newTokenId);
        _tokenOptions[newTokenId] = option;
        _presidentVote[newTokenId] = president;

        _tokensVoted[option]++;
        _presidentVotes[president]++;

        _hasMinted[msg.sender] = true;

    }

    // helper function to compare strings
    function compareStrings(string memory a, string memory b)
        public pure returns (bool)
    {
        return (keccak256(abi.encodePacked((a))) ==
            keccak256(abi.encodePacked((b))));
    }
}