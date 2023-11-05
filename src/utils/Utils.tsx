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
