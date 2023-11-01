import * as sanitizeHtml from 'sanitize-html'

export function sanitizeInput(value: string) {
    return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape',
    })
}

export function lowercaseString(value: string) {
    return value?.toLowerCase()?.trim()
}
