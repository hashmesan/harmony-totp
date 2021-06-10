pragma solidity ^0.7.6;

library HOTPUtil {
    function _deriveChildTreeIdx(bytes20 sides) private view returns (uint32) {
        uint32 derivedIdx = 0;
        for(uint8 i = 0 ; i <wallet.merkelHeight ; i++){
            if(byte(0x01) == sides[i]){
                derivedIdx |=  uint32(0x01) << i;
            }
        }
        return derivedIdx;
    }
    
    function _reduceConfirmMaterial(bytes16[] memory confirmMaterial, bytes20 sides) public returns (bytes16) {
        //  and then compute h(OTP) to get the leaf of the tree
        confirmMaterial[0] = bytes16(keccak256(abi.encodePacked(confirmMaterial[0])));
        return _reduceAuthPath(confirmMaterial, sides);
    }

    function _reduceAuthPath(bytes16[] memory authPath, bytes20 sides) internal returns (bytes16){
        for (uint8 i = 1; i < authPath.length ; i++) {
            if(byte(0x00) == sides[i - 1]){
                authPath[0] = bytes16(keccak256(abi.encodePacked(authPath[0], authPath[i])));
            } else{
                authPath[0] = bytes16(keccak256(abi.encodePacked(authPath[i], authPath[0])));
            }
        }
        //emit DebugEvent(authPath[0]);
        return authPath[0];
    }
    
}