import { createElement, useRef, useEffect, ReactElement } from "react";
import Hls from "hls.js";
import Artplayer from "artplayer";

function playM3u8(video: any, url: any, art: any): any {
    if (Hls.isSupported()) {
        if (art.hls) {
            art.hls.destroy();
        }
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        art.hls = hls;
        art.on("destroy", () => hls.destroy());
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
    } else {
        art.notice.show = "Unsupported playback format: m3u8";
    }
}

export default function Player({ option, getInstance, ...rest }: any): ReactElement {
    const artRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        const art = new Artplayer({
            ...option,
            container: artRef.current,
            customType: {
                m3u8: playM3u8
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
    }, [option, getInstance]);

    return <div ref={artRef} {...rest}></div>;
}
