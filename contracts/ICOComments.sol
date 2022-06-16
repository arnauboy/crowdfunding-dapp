// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract ICOComments is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _commentIds;

    struct ICOComment {
        uint commentId;
        address commentator;
        string message;
        address ico;
        uint parentCommentId; //0 if not a reply to a comment
    }

    mapping(uint256 => ICOComment) private idToComment;

    //Comment have id >= 1, because we use parentCommentId = 0 for those comments which are not replies
    function comment(address user, string calldata message, address ico) public nonReentrant{
        _commentIds.increment();
        uint id = _commentIds.current();
        idToComment[id] = ICOComment(
        id,
        user,
        message,
        ico,
        0
        );

    }

    function reply(address user, string calldata message, uint parentCommentId, address ico) public nonReentrant{
        require(parentCommentId != 0, "Wrong parent identifier");
        _commentIds.increment();
        uint id = _commentIds.current();
        idToComment[id] = ICOComment(
        id,
        user,
        message,
        ico,
        parentCommentId
        );

    }

    //Get ico comments. Replies excluded
    function getComments(address ico) public view returns (ICOComment[] memory){
        uint commentsCount = _commentIds.current();
        uint nComments = 0;
        for (uint i = 1; i <= commentsCount; ++i) {
        if (idToComment[i].ico == ico && idToComment[i].parentCommentId == 0) {
            ++nComments;
        }
    }

    ICOComment[] memory comments = new ICOComment[](nComments);
    uint currentIndex = 0;
    for (uint i = 1; i <= commentsCount; i++) {
      if (idToComment[i].ico == ico && idToComment[i].parentCommentId == 0) {
        uint currentItemId = i;
        ICOComment memory currentItem = idToComment[currentItemId];
        comments[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return comments;
  }

  //Get comment replies
  function getReplies(uint commentId) public view returns (ICOComment[] memory) {
    require(commentId != 0, "Comment identifier cannot be zero");
    uint commentsCount = _commentIds.current();
    uint nReplies = 0;
    for (uint i = 1; i<= commentsCount; ++i) {
      if (idToComment[i].parentCommentId == commentId) {
        ++nReplies;
      }
    }

    ICOComment[] memory replies = new ICOComment[](nReplies);
    uint currentIndex = 0;
    for (uint i = 1; i <= commentsCount; i++) {
      if (idToComment[i].parentCommentId == commentId) {
        uint currentItemId = i;
        ICOComment memory currentItem = idToComment[currentItemId];
        replies[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return replies;
  }

  //Get number of replies
  function getNumberOfReplies(uint commentId) public view returns (uint) {
    require(commentId != 0, "Comment identifier cannot be zero");
    uint commentsCount = _commentIds.current();
    uint nReplies = 0;
    for (uint i = 1; i<= commentsCount; ++i) {
      if (idToComment[i].parentCommentId == commentId) {
        ++nReplies;
      }
    }
    return nReplies;
  }

  function getComment(uint256 id) public view returns (ICOComment memory) {
        return idToComment[id];
  }

}
