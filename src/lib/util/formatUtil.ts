export function titleCase(str: String) {
    return str.replace('_', ' ').toLowerCase().replace(/(?:^|\s)\w/g, function(match) {
        return match.toUpperCase();
    });
}