// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {DesignClub} from "../src/DesignClub.sol";

contract SetPaymentTokenScript is Script {
    function run() external {
        // deployer private key, DESIGN_CLUB_ADDRESS and PAYMENT_TOKEN_ADDRESS should be set in your env
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address clubAddr = vm.envAddress("DESIGN_CLUB_ADDRESS");
        address tokenAddr = vm.envAddress("PAYMENT_TOKEN_ADDRESS");

        vm.startBroadcast(pk);
        DesignClub(clubAddr).setPaymentToken(tokenAddr);
        vm.stopBroadcast();
    }
}
