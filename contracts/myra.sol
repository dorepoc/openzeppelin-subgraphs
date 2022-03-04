// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";

contract ArkRivals is ERC721 {
    constructor() ERC721("Ark Rivals", "ARKN") {}
}

