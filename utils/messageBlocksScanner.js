module.exports = (messageList, blockType, blockId) => {

    const blockList = messageList["blocks"];

    for(let i = 0; i < blockList.length; i++){

        if(blockList[i]["type"] === blockType && blockList[i]["block_id"] === blockId){

            return blockList[i];
        }
    }

    return null;
};