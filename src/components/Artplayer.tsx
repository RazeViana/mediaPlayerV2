import { createElement, useRef, useEffect, ReactElement } from "react";
import { commit, playM3u8 } from "src/utils/Utils";
import Artplayer from "artplayer";

export default function Player({ option, getInstance, customOption, ...rest }: any): ReactElement {
    const artRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        let lastFrameIntervalRunning = false;
        let lastFrameIntervalId: any;

        const art = new Artplayer({
            ...option,
            container: artRef.current,
            customType: {
                m3u8: playM3u8
            }
        });

        // Commits latest frame to MxObject
        function updateLastFrameWatched(): void {
            if (lastFrameIntervalRunning === false) {
                lastFrameIntervalRunning = true;
                const intervalId = setInterval(() => {
                    if (art.playing && customOption.userEpisodeGuid) {
                        lastFrameIntervalId = intervalId;
                        commit(customOption.userEpisodeGuid, "LastFrameWatched", Math.round(art.currentTime));
                    } else {
                        lastFrameIntervalRunning = false;
                        clearInterval(intervalId);
                    }
                }, 3000);
            }
        }

        art.on("video:timeupdate", () => {
            updateLastFrameWatched();
        });

        art.on("destroy", () => {
            if (lastFrameIntervalRunning === true) {
                clearInterval(lastFrameIntervalId);
                lastFrameIntervalId = null;
                console.log("BOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOM");
            }
        });

        if (getInstance && typeof getInstance === "function") {
            getInstance(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, [option, customOption, getInstance]);

    return <div ref={artRef} {...rest}></div>;
}
