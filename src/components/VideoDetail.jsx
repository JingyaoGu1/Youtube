import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import { Typography, Box, Stack } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { Videos, Loader } from "./";
import { fetchFromAPI } from "../utils/fetchFromAPI";

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [videos, setVideos] = useState(null);
  const [comments, setComments] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
      .then((data) => setVideoDetail(data.items[0]))

    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
      .then((data) => setVideos(data.items))

    fetchFromAPI(`commentThreads?part=snippet&videoId=${id}&maxResults=1000`)
      .then((data) => setComments(data.items))
  }, [id]);

  useEffect(() => {
    if (comments) {
      const sortedComments = comments.sort((a, b) => {
        const likesA = a.snippet.topLevelComment.snippet.likeCount || 0;
        const likesB = b.snippet.topLevelComment.snippet.likeCount || 0;
        return likesB - likesA;
      });
  
      const topFiveComments = sortedComments.slice(0, 1000);
  
      topFiveComments.forEach(comment => {
        if (comment.snippet && comment.snippet.topLevelComment && comment.snippet.topLevelComment.snippet) {
          const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
          const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
          const likeCount = comment.snippet.topLevelComment.snippet.likeCount || 0;
          console.log(`${author}: ${commentText}`);
        }
      });
    }
  }, [comments]);
  
  
  if(!videoDetail?.snippet) return <Loader />;

  const { snippet: { title, channelId, channelTitle }, statistics: { viewCount, likeCount } } = videoDetail;

  const renderComments = (comments) => {
    return comments.map((comment, index) => (
      <Box key={index} sx={{ my: 2 }}>
        <img 
        src={comment.snippet.topLevelComment.snippet.authorProfileImageUrl} 
        alt="Author's profile" 
        style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px' }}
      />
        <Typography variant="subtitle2" sx={{ color: 'gray' }}>
          {comment.snippet.topLevelComment.snippet.authorDisplayName}
          <Typography component="span" variant="body2" sx={{ ml: 1, color: 'red' }}>
            {comment.snippet.topLevelComment.snippet.likeCount || 0} Likes
          </Typography>
        </Typography>
        <Typography variant="body2">
          {comment.snippet.topLevelComment.snippet.textDisplay}
        </Typography>
      </Box>
    ));
  };

  return (
    <Box minHeight="95vh">
      <Stack direction={{ xs: "column", md: "row" }}>
        <Box flex={1}>
          <Box sx={{ width: "100%", position: "relative", top: "86px" }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls />
            <Typography color="black" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ color: "black" }} py={1} px={2} >
              <Link to={`/channel/${channelId}`}>
                <Typography variant={{ sm: "subtitle1", md: 'h6' }}  color="black" sx={{ fontSize: '20px' }}>
                  {channelTitle}
                  <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7, fontSize: '20px' , marginTop: '5px'}}>
                  {parseInt(viewCount).toLocaleString()} views
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7, fontSize: '20px', marginTop: '5px'}}>
                  {parseInt(likeCount).toLocaleString()} likes
                </Typography>
                <Box sx={{ mt: 4 }}>
                  {comments ? renderComments(comments.slice(0, 1000)) : <Typography>Loading comments...</Typography>}
                </Box>
              </Link>
              {/* <Stack direction="row" gap="20px" alignItems="center">
              </Stack> */}
            </Stack>
          </Box>
        </Box>
        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;

