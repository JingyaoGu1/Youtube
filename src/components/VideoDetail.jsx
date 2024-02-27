// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import ReactPlayer from "react-player";
// import { Typography, Box, Stack } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// import { Videos, Loader } from "./";
// import { fetchFromAPI } from "../utils/fetchFromAPI";

// const VideoDetail = () => {
//   const [videoDetail, setVideoDetail] = useState(null);
//   const [videos, setVideos] = useState(null);
//   const [comments, setComments] = useState(null)
//   const { id } = useParams();

//   useEffect(() => {
//     fetchFromAPI(`videos?part=snippet,statistics&id=${id}`)
//       .then((data) => setVideoDetail(data.items[0]))

//     fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`)
//       .then((data) => setVideos(data.items))

//     fetchFromAPI(`commentThreads?part=snippet&videoId=${id}&maxResults=10`)
//     .then((data) => setComments(data.items))
//   }, [id]);

//   useEffect(() => {
//     const topFiveComments = comments.slice(0, 5);
//     topFiveComments.forEach(comment => {
//       const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
//       const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
//       console.log(`${author}: ${commentText}`);
//     });
//   }, [comments]);
  
  

//   if(!videoDetail?.snippet) return <Loader />;
//   // if(!comments?.snippet) return <Loader />;

//   const { snippet: { title, channelId, channelTitle }, statistics: { viewCount, likeCount } } = videoDetail;
//   // const { snippet: {videoId}} = comments;
//   // console.log(videoId);

//   // console.log(textDisplay)


//   return (
//     <Box minHeight="95vh">
//       <Stack direction={{ xs: "column", md: "row" }}>
//         <Box flex={1}>
//           <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
//             <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls />
//             <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
//               {title}
//             </Typography>
//             <Stack direction="row" justifyContent="space-between" sx={{ color: "#fff" }} py={1} px={2} >
//               <Link to={`/channel/${channelId}`}>
//                 <Typography variant={{ sm: "subtitle1", md: 'h6' }}  color="#fff" >
//                   {channelTitle}
//                   <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
//                 </Typography>
//               </Link>
//               <Stack direction="row" gap="20px" alignItems="center">
//                 <Typography variant="body1" sx={{ opacity: 0.7 }}>
//                   {parseInt(viewCount).toLocaleString()} views
//                 </Typography>
//                 <Typography variant="body1" sx={{ opacity: 0.7 }}>
//                   {parseInt(likeCount).toLocaleString()} likes
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Box>
//         </Box>
//         <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center" >
//           <Videos videos={videos} direction="column" />
//         </Box>
//       </Stack>
//     </Box>
//   );
// };

// export default VideoDetail;

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

    fetchFromAPI(`commentThreads?part=snippet&videoId=${id}&maxResults=10`)
      .then((data) => setComments(data.items))
  }, [id]);

  useEffect(() => {
    if (comments) {
      const topFiveComments = comments.slice(0, 5);
      topFiveComments.forEach(comment => {
        if (comment.snippet && comment.snippet.topLevelComment && comment.snippet.topLevelComment.snippet) {
          const commentText = comment.snippet.topLevelComment.snippet.textDisplay;
          const author = comment.snippet.topLevelComment.snippet.authorDisplayName;
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
        <Typography variant="subtitle2" sx={{ color: 'gray' }}>
          {comment.snippet.topLevelComment.snippet.authorDisplayName}
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
          <Box sx={{ width: "100%", position: "sticky", top: "86px" }}>
            <ReactPlayer url={`https://www.youtube.com/watch?v=${id}`} className="react-player" controls />
            <Typography color="#fff" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>
            <Stack direction="row" justifyContent="space-between" sx={{ color: "#fff" }} py={1} px={2} >
              <Link to={`/channel/${channelId}`}>
                <Typography variant={{ sm: "subtitle1", md: 'h6' }}  color="#fff" >
                  {channelTitle}
                  <CheckCircleIcon sx={{ fontSize: "12px", color: "gray", ml: "5px" }} />
                </Typography>
              </Link>
              <Stack direction="row" gap="20px" alignItems="center">
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(viewCount).toLocaleString()} views
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7 }}>
                  {parseInt(likeCount).toLocaleString()} likes
                </Typography>
                <Box sx={{ mt: 4 }}>
                  {comments ? renderComments(comments.slice(0, 5)) : <Typography>Loading comments...</Typography>}
                </Box>
              </Stack>
            </Stack>
          </Box>
        </Box>
        <Box px={2} py={{ md: 1, xs: 5 }} justifyContent="center" alignItems="center">
          <Videos videos={videos} direction="column" />
          
          {/* Render comments here */}
        </Box>
      </Stack>
    </Box>
  );
};

export default VideoDetail;

