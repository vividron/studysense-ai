export const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const units = ["B", "KB", "MB"]; // Till MB (size limit is 10MB)
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
    }

    return `${Math.round(size)} ${units[unitIndex]}`;
};