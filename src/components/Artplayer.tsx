import { createElement, useRef, useEffect, ReactElement } from "react";
import { commit, playM3u8 } from "src/utils/Utils";
import Artplayer from "artplayer";
import { SkipIntroButton, SkipOutroButton } from "../assets/SkipButtons";

export default function Player({ option, getInstance, customOption, ...rest }: any): ReactElement {
    const artRef = useRef<HTMLDivElement>(null!);

    useEffect(() => {
        let lastFrameIntervalRunning = false;
        let lastFrameIntervalId: any;
        let isShowingIntroButton = false;
        let isShowingOutroButton = false;

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

        function checkIfIntro(currentTime: number): boolean {
            if (currentTime > customOption.introStart && currentTime < customOption.introEnd) {
                return true;
            } else {
                return false;
            }
        }

        function checkIfOutro(currentTime: number): boolean {
            if (currentTime > customOption.outroStart && currentTime < customOption.outroEnd) {
                return true;
            } else {
                return false;
            }
        }

        function showSkipIntroButton(): void {
            art.layers.add({
                name: "skipIntro",
                html: `<img style="width: 130px" src="${SkipIntroButton.imagedata}"/>`,
                style: {
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "60px",
                    left: "20px"
                },
                click() {
                    art.seek = customOption.introEnd;
                    art.layers.remove("skipIntro");
                    isShowingIntroButton = false;
                },
                mounted() {
                    isShowingIntroButton = true;
                }
            });
        }

        function showSkipOutroButton(): void {
            art.layers.add({
                name: "skipOutro",
                html: `<img style="width: 130px" src="${SkipOutroButton.imagedata}"/>`,
                style: {
                    cursor: "pointer",
                    position: "absolute",
                    bottom: "60px",
                    left: "20px"
                },
                click() {
                    art.seek = customOption.outroEnd;
                    art.layers.remove("skipOutro");
                    isShowingOutroButton = false;
                },
                mounted() {
                    isShowingOutroButton = true;
                }
            });
        }

        function skipIntroOrOutro(): void {
            const defaultSettings = {
                autoSkip: false
            };
            let settings;

            try {
                const settingsStr = localStorage.getItem("artplayer_settings");
                settings = settingsStr ? JSON.parse(settingsStr) : defaultSettings;
            } catch (error) {
                console.error("Failed to parse settings from localStorage:", error);
                settings = defaultSettings;
            }

            if (checkIfIntro(art.currentTime)) {
                if (settings.autoSkip) {
                    art.seek = customOption.introEnd;
                    isShowingIntroButton = false;
                } else {
                    if (!isShowingIntroButton) {
                        showSkipIntroButton();
                    }
                }
            } else {
                if (isShowingIntroButton) {
                    art.layers.remove("skipIntro");
                    isShowingIntroButton = false;
                }
            }
            if (checkIfOutro(art.currentTime)) {
                if (settings.autoSkip) {
                    art.seek = customOption.outroEnd;
                    isShowingOutroButton = false;
                } else {
                    if (!isShowingOutroButton) {
                        showSkipOutroButton();
                    }
                }
            } else {
                if (isShowingOutroButton) {
                    art.layers.remove("skipOutro");
                    isShowingOutroButton = false;
                }
            }
        }

        art.on("ready", () => {
            art.seek = customOption.lastFrameWatched;
        });

        art.on("video:timeupdate", () => {
            updateLastFrameWatched();
            skipIntroOrOutro();
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
