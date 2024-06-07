// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract doc {
    struct Memo {
        string NCD_ID;
        string DocType_ID;  
        string user_ID;  
        string[] data;
        string[][] history;
    }

    Memo[] memos;
    
    // add document in blockchain
    function addDocs(string memory NCD_ID, string memory DocType_ID, string memory user_ID, string[] memory data, string[][] memory history) public{
        memos.push(Memo(NCD_ID, DocType_ID,user_ID,data, history));
    }

    // Add document visited history
    function addHistoryArray(string memory _NCD_ID, string[] memory _newHistoryArray) public {
        // Iterate through the memos array to find the Memo with the matching NCD_ID
        for (uint256 i = 0; i < memos.length; i++) {
            if (keccak256(abi.encodePacked(memos[i].NCD_ID)) == keccak256(abi.encodePacked(_NCD_ID))) {
                // Found the matching Memo, append the new history array to its existing history
                memos[i].history.push(_newHistoryArray);
                break; // Break out of the loop once the update is done
            }
        }
    }

    // get Document
    function getDocs() public view returns (Memo[] memory) {
        return memos;
    }
}
