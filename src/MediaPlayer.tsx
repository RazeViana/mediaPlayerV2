import { ReactElement, createElement } from "react";
import { MediaPlayerContainerProps } from "../typings/MediaPlayerProps";
import { AutoSkipImage } from "./assets/AutoSkip";
import Artplayer from "./components/Artplayer";
import { isAvailable, getOrCreateLocalStorage } from "./utils/Utils";
import "./ui/MediaPlayer.css";

export function MediaPlayer(props: MediaPlayerContainerProps): ReactElement {
    return (
        <div>
            <Artplayer
                option={{
                    url: isAvailable(props.MediaURL) ? (props.MediaURL.value as string) : "",
                    type: "m3u8",
                    autoSize: true,
                    poster: isAvailable(props.PosterURL) ? (props.PosterURL?.value as string) : "",
                    theme: isAvailable(props.PlayerTheme) ? (props.PlayerTheme?.value as string) : "#000000",
                    fullscreen: true,
                    airplay: true,
                    setting: true,
                    hotkey: true,
                    pip: false,
                    icons: {
                        state: `<img src=${isAvailable(props.PauseStateLogo) ? props.PauseStateLogo?.value?.uri : ""}>`,
                        loading: `<img width=${
                            isAvailable(props.LoadingStateAnimWidth) ? props.LoadingStateAnimWidth : 70
                        } 
                            height=${isAvailable(props.LoadingStateAnimHeight) ? props.LoadingStateAnimHeight : 70} 
                            src=${isAvailable(props.LoadingStateAnim) ? props.LoadingStateAnim?.value?.uri : ""}>`
                    },
                    settings: [
                        {
                            html: "Auto Skip Intro",
                            icon: `<img width="22" heigth="22" style="filter: brightness(0) invert(1);" 
                                src="${AutoSkipImage.imagedata}">`,
                            tooltip: getOrCreateLocalStorage().autoSkip === false ? "Off" : "On",
                            switch: getOrCreateLocalStorage().autoSkip,
                            onSwitch(item: any) {
                                item.tooltip = item.switch ? "OFF" : "ON";
                                const localStorageSetting = getOrCreateLocalStorage();
                                const updatedSetting = {
                                    ...localStorageSetting,
                                    autoSkip: !item.switch
                                };
                                localStorage.setItem("artplayer_settings", JSON.stringify(updatedSetting));
                                return !item.switch;
                            }
                        }
                    ]
                }}
                customOption={{
                    userEpisodeGuid: isAvailable(props.UserEpisodeGuid) ? props.UserEpisodeGuid.value : "",
                    lastFrameWatched: isAvailable(props.LastFrameWatched) ? props.LastFrameWatched.value : "",
                    introStart: isAvailable(props.IntroStart) ? props.IntroStart.value : "",
                    introEnd: isAvailable(props.IntroEnd) ? props.IntroEnd.value : "",
                    outroStart: isAvailable(props.OutroStart) ? props.OutroStart.value : "",
                    outroEnd: isAvailable(props.OutroEnd) ? props.OutroEnd.value : ""
                }}
                getInstance={(art: Artplayer) => console.log(art)}
            />
        </div>
    );
}
