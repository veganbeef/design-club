// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {DesignClub} from "../src/DesignClub.sol";

contract DesignClubScript is Script {
    DesignClub public club;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        club = new DesignClub();

        vm.stopBroadcast();
    }
}
