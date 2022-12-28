//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

library TranslateTypes
{

    function stringToUint256(string memory _str) internal pure returns(uint256 res) 
    {
        bytes memory stringNumber = bytes(_str);
        for (uint256 i = 0; i < bytes(_str).length; i++) 
        {
			uint8 codeSymbol = uint8(stringNumber[i]) - 48; 
            if (codeSymbol < 0 || codeSymbol > 9) 
            {
                return 0;
            }
            assembly
            {

                let len := mload(stringNumber)
                let level10 := exp(0xA,sub(sub(len,i),1))
                res := add(res, mul(codeSymbol,level10))
            }
        }
    
        return res;
    } 

    function uintTostring(uint _number) internal pure returns (string memory _uintAsString) 
    {
        bytes memory curNumber = new bytes(32);
		if(_number==0)
			return "0";
        assembly
        {
            function calculateLenBytes(_num) -> len 
            {
                let num := _num
                for { } gt(num,0) {}
                {
                    len:=add(len,0x1)
                    num:= div(num,0xA)
                }
            }
            
            let length := calculateLenBytes(_number)
            let indexByte := length
            let temp
            //curNumber := mload(length)
            for { } gt(_number,0) {}
            { 
                temp := add(  0x30, sub(_number, mul(div(_number,0xA),0xA)))

                mstore(add(curNumber,indexByte),temp)
                indexByte := sub(indexByte,0x1)
                _number:= div(_number,0xA)
            }
            mstore(curNumber,length)
        }

        return string(curNumber);
    }

}