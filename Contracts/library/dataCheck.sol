//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

library DataCheck
{

    function isEmptyData(string[] memory _data,bool typeData) internal pure returns(bool)
    {
        return !(_checkData(_data,typeData));
    }

    function isEmptyCurrentString(string memory _str) internal pure returns(bool)
    {
        return !(_checkString(_str));
    }

    function _checkData(string[] memory _data,bool typeData) private pure returns(bool isEmpty)
    {
        assembly
        {
            isEmpty := 0
            let len := mload(_data)
            if gt(len,0)
            {
                isEmpty :=1
                for {let i:=0} lt(i,len) { i:= add(i,1)}
                {
                    let cur := mload(add(add(_data, 0x20), mul(i, 0x20))) 
                    let lengthCurStr := mload(cur)
                    if eq(lengthCurStr,0x0)
					{
						if or(and(not(eq(i,2)),eq(typeData,0)) , and(not(eq(i,5)),eq(typeData,1)))
						{
							isEmpty :=0
							break
						}

					}
                }
            }
            
        }
        return isEmpty;
    }

    function _checkString(string memory _str) private pure returns(bool)
    {
        if(bytes(_str).length==0)
            return false;
        else
            return true;
    }
}