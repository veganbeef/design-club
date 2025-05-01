// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {DesignClub} from "../src/DesignClub.sol";

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

// Minimal mock token for testing
contract MockERC20 is IERC20 {
    mapping(address => uint256) public balances;
    function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
        require(balances[from] >= amount, "Insufficient balance");
        balances[from] -= amount;
        balances[to] += amount;
        return true;
    }
    function mint(address to, uint256 amount) external {
        balances[to] += amount;
    }
}

contract DesignClubTest is Test {
    DesignClub designClub;
    MockERC20 mockERC20;
    address user = address(0xBEEF);

    function setUp() public {
        designClub = new DesignClub();
        mockERC20 = new MockERC20();
    }
    
    function testSetCostByAdmin() public {
        uint256 newCost = 100;
        designClub.setCost(newCost);
        assertEq(designClub.cost(), newCost);
    }
    
    function testSetCostByNonAdmin() public {
        vm.prank(user);
        vm.expectRevert("Only admin can set cost");
        designClub.setCost(100);
    }
    
    function testSetPaymentTokenByAdmin() public {
        designClub.setPaymentToken(address(mockERC20));
        assertEq(address(designClub.paymentToken()), address(mockERC20));
    }
    
    function testSetPaymentTokenByNonAdmin() public {
        vm.prank(user);
        vm.expectRevert("Only admin can set payment token");
        designClub.setPaymentToken(address(mockERC20));
    }
    
    function testPay() public {
        designClub.setPaymentToken(address(mockERC20));
        uint256 cost = 150;
        designClub.setCost(cost);
        vm.prank(user);
        mockERC20.mint(user, 200);
        vm.prank(user);
        designClub.pay();
        assertTrue(designClub.hasPaid(user));
        assertEq(mockERC20.balances(address(designClub)), cost);
        assertEq(mockERC20.balances(user), 50);
    }
    
    function testPayAlreadyPaid() public {
        designClub.setPaymentToken(address(mockERC20));
        designClub.setCost(100);
        vm.prank(user);
        mockERC20.mint(user, 200);
        vm.prank(user);
        designClub.pay();
        vm.prank(user);
        vm.expectRevert("Already paid");
        designClub.pay();
    }
    
    function testAdminTransfer() public {
        address newAdmin = address(0xCAFE);
        designClub.transferAdmin(newAdmin);
        vm.prank(user);
        vm.expectRevert("Only pending admin can accept");
        designClub.acceptAdmin();
        vm.prank(newAdmin);
        designClub.acceptAdmin();
        assertEq(designClub.admin(), newAdmin);
    }
}
