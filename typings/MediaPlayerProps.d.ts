/**
 * This file was generated from MediaPlayer.xml
 * WARNING: All changes made to this file will be overwritten
 * @author Mendix Widgets Framework Team
 */
import { CSSProperties } from "react";
import { DynamicValue, WebImage } from "mendix";

export interface MediaPlayerContainerProps {
    name: string;
    class: string;
    style?: CSSProperties;
    tabIndex?: number;
    MediaURL: DynamicValue<string>;
    SubtitleURL?: DynamicValue<string>;
    IntroStart: DynamicValue<string>;
    IntroEnd: DynamicValue<string>;
    OutroStart: DynamicValue<string>;
    OutroEnd: DynamicValue<string>;
    UserEpisodeGuid: DynamicValue<string>;
    LastFrameWatched: DynamicValue<string>;
    PosterURL?: DynamicValue<string>;
    PlayerTheme: DynamicValue<string>;
    PauseStateLogo?: DynamicValue<WebImage>;
    LoadingStateAnim?: DynamicValue<WebImage>;
    LoadingStateAnimWidth: number;
    LoadingStateAnimHeight: number;
}

export interface MediaPlayerPreviewProps {
    /**
     * @deprecated Deprecated since version 9.18.0. Please use class property instead.
     */
    className: string;
    class: string;
    style: string;
    styleObject?: CSSProperties;
    readOnly: boolean;
    MediaURL: string;
    SubtitleURL: string;
    IntroStart: string;
    IntroEnd: string;
    OutroStart: string;
    OutroEnd: string;
    UserEpisodeGuid: string;
    LastFrameWatched: string;
    PosterURL: string;
    PlayerTheme: string;
    PauseStateLogo: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    LoadingStateAnim: { type: "static"; imageUrl: string; } | { type: "dynamic"; entity: string; } | null;
    LoadingStateAnimWidth: number | null;
    LoadingStateAnimHeight: number | null;
}
