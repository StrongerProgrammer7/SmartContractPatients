//SPDX-License-Identifier: MIT
//modify openZepplin Ownable
//Foundation openZepplin/contracts/access/Ownable.sol
pragma solidity ^0.8.7;

abstract contract Owner
{
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner); 

    modifier onlyOwner(address _sender)
    {
        _checkOwner(_sender);
        _;
    }

    constructor(address _newOwner) 
    {
        _transferOwnership(_newOwner);
    }
    
    function _checkOwner(address _sender) internal view virtual 
    {
        require(owner() == _sender, "Ownable: caller is not the owner");
    }

    function owner() public view virtual returns (address) 
    {
        return _owner;
    }

    function transferOwnership(address _newOwner) public virtual onlyOwner(_owner) 
    {
        require(_newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(_newOwner);
    }

    function _transferOwnership(address _newOwner) private  
    {
        address oldOwner = _owner;
        _owner = _newOwner;
        emit OwnershipTransferred(oldOwner, _newOwner);
    }

    function renounceOwnership(address _ownerContract) internal virtual onlyOwner(_ownerContract) 
    {
        _transferOwnership(address(0));
    }
    
}