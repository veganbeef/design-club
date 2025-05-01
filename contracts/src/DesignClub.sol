//// filepath: /Users/quazia/Documents/gh/design-club/contracts/src/PaymentContract.sol
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

contract DesignClub {
    address public admin;
    address public pendingAdmin;
    uint256 public cost;
    IERC20 public paymentToken;

    mapping(address => bool) public hasPaid;

    constructor() {
        admin = msg.sender; // Deploying address becomes admin
    }

    // Admin can set the cost
    function setCost(uint256 _newCost) external {
        require(msg.sender == admin, "Only admin can set cost");
        cost = _newCost;
    }

    // Admin can set which ERC20 token is used for payment
    function setPaymentToken(address _token) external {
        require(msg.sender == admin, "Only admin can set payment token");
        paymentToken = IERC20(_token);
    }

    // Users pay the required cost in the configured token
    function pay() external {
        require(!hasPaid[msg.sender], "Already paid");
        require(paymentToken.transferFrom(msg.sender, address(this), cost), "Transfer failed");
        hasPaid[msg.sender] = true;
    }

    // Latch-based admin transfer:
    // Old admin sets a new admin, then the new admin accepts in a second transaction
    // Start of changed code
    function transferAdmin(address _newAdmin) external {
        require(msg.sender == admin, "Only admin can set new admin");
        pendingAdmin = _newAdmin;
    }

    function acceptAdmin() external {
        require(msg.sender == pendingAdmin, "Only pending admin can accept");
        admin = pendingAdmin;
        pendingAdmin = address(0);
    }
}