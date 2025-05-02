// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DesignClub} from "../src/DesignClub.sol";

contract TransferAdminScript is Script {
    function run() external {
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address clubAddr = vm.envAddress("DESIGN_CLUB_ADDRESS");
        address newAdmin = vm.envAddress("NEW_ADMIN");

        vm.startBroadcast(pk);
        DesignClub(clubAddr).transferAdmin(newAdmin);
        vm.stopBroadcast();
    }
}
