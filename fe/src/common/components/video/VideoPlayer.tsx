import {UseVideoReturn} from "../../hooks/useVideo";
import React, {useLayoutEffect, useRef} from "react";
import videojs from "video.js";
import {Box, Flex, IconButton} from "@chakra-ui/react";
import {X} from "tabler-icons-react";
import VideoPlayerEditor from "./VideoPlayerEditor";
import {VideoType} from "../../api/videoAPI";

const VideoPlayer = ({video}:{video:VideoType}) => {
    const playerRef = useRef<any>(null);

    useLayoutEffect(() => {
        if (video) {
            if (playerRef.current) {
                const videoOptions = {
                    autoplay: false,
                    controls: true,
                    responsive: false,
                    playbackRates: [0.5, 0.75, 1, 1.25, 1.5],
                    controlBar: {
                        playToggle: true,
                        pictureInPictureToggle: false,
                        remainingTimeDisplay: true,
                        progressControl: true,
                        qualitySelector: true,

                        volumePanel: {inline: true},
                    },
                };

                const player = videojs(
                    playerRef.current,
                    videoOptions,
                    function onPlayerReady() {
                        console.log("Video Player is ready");
                    }
                );

                // player.poster(`${videoState?.video?.thumbnail?.fileUrl}`); //youtube thumbnail
                player.src({
                    src: `${process.env.REACT_APP_VIDEO_SERVER}/resources/${video.path}`,
                    type: "application/x-mpegURL",
                });

                return () => {
                    if (player) {
                        player.dispose();
                    }
                };
            }
        }
    }, [video]);

    return <>
        {video && (
            <Box w={"100%"} margin={"auto"} minH={"30vh"} mb={5}>
                <Flex  w={"100%"} justifyContent="center" alignItems="center" overflow={"hidden"} position={"relative"}>
                    <video
                        ref={playerRef}
                        className={"video-js vjs-big-play-centerd vjs-fluid"}
                    />
                </Flex>
            </Box>
        )}
    </>
}

export default VideoPlayer;
