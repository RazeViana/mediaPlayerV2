import Hls from "hls.js";

declare let mx: any;

// Checks if attribute from mendix is available
export const isAvailable = (property: any): boolean => {
    const status = property && property.status === "available" && property.value;
    return !!status;
};

// Gets the local storage JSON, if not then it creates one
export function getOrCreateLocalStorage(): { autoSkip: boolean } {
    const defaultSettings = { autoSkip: false };
    const storedSettings = localStorage.getItem("artplayer_settings");

    if (storedSettings) {
        return JSON.parse(storedSettings);
    }

    localStorage.setItem("artplayer_settings", JSON.stringify(defaultSettings));
    return defaultSettings;
}

// M3u8 Helper function
export function playM3u8(video: any, url: any, art: any): any {
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

// Calls MF in Mendix and commits
export function commit(ObjGuid: string, attribute: string, value: number): void {
    console.log("GUID: " + ObjGuid + " attribute: " + attribute + " value: " + value);
    // eslint-disable-next-line no-undef
    mx.data.get({
        guid: ObjGuid,
        callback(obj: any) {
            obj.set(attribute, value);
            // eslint-disable-next-line no-undef
            mx.data.action({
                params: {
                    applyto: "selection",
                    actionname: "AbyssTV.Widget_CommitUserEpisode",
                    guids: [obj.getGuid()]
                }
            });
        }
    });
}
