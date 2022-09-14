interface YoutubeCommentResponse{
  "kind": "youtube#commentThreadListResponse",
  "etag": "jLQ1wnrQPvehBD_UTa5mTVn53QA",
  "nextPageToken": "QURTSl9pMzh3RlJLZGNPRnFRZDZ6Z2ZLak1ENTZpeDk2UGI5RXRYaTZZSFFmSURIRmlyaEdsTFJ1QnNZX3FCaFdKclZnVjRocHFxTmVBb3ZuOEY1c0FncFpuUEZYZlMtTnBiQnJxbkZWOWZkTGhUQ0k0dVQyaFNqbDFSa1lmaXJVNF9nM3Vz",
  "pageInfo": {
    "totalResults": 5,
    "resultsPerPage": 5
  },
  "items": YoutubeCommentItem[]
}

interface YoutubeCommentItem {
  "kind": "youtube#commentThread",
  "etag": "QEBhW0lfoEcyXg7SgAoV5Q_U6to",
  "id": "UgzTJ9zZLud3aDoXibB4AaABAg",
  "snippet": YoutubeCommentSnippet
}

interface YoutubeCommentSnippet{
  "videoId": "DYptgVvkVLQ",
  "topLevelComment": YoutubeTopLevelCommentSnippet,
  "canReply": true,
  "totalReplyCount": 4,
  "isPublic": true
}

interface YoutubeTopLevelCommentSnippet{
  "kind": "youtube#comment",
  "etag": "QB2DaGHh1FsNQz6W3llWfcByO-M",
  "id": "UgzTJ9zZLud3aDoXibB4AaABAg",
  "snippet": YoutubeTopLevelCommentSnippetContent
}

interface YoutubeTopLevelCommentSnippetContent{
  "videoId": "DYptgVvkVLQ",
  "textDisplay": "我的青春都被寫在這首歌裡了，它的存在對我來說意義很大<br>謝謝你，周杰倫",
  "textOriginal": "我的青春都被寫在這首歌裡了，它的存在對我來說意義很大\n謝謝你，周杰倫",
  "authorDisplayName": "kathyyy",
  "authorProfileImageUrl": "https://yt3.ggpht.com/F-d01-lCWKJrTNaeErZV_fcFBwdjGLofVjXqkS8t3JiGs-6rcbkZgXLOqm66O4CqVhSaQ2u0=s48-c-k-c0x00ffffff-no-rj",
  "authorChannelUrl": "http://www.youtube.com/channel/UCY0WwO8fP8b_BfmxdFaTVDA",
  "authorChannelId": {
    "value": "UCY0WwO8fP8b_BfmxdFaTVDA"
  },
  "canRate": true,
  "viewerRating": "none",
  "likeCount": 249,
  "publishedAt": "2021-06-03T05:35:24Z",
  "updatedAt": "2021-06-03T05:35:24Z"
}
