/**
 * Contains Utils related to the use of strings
 *
 * @packageDocumentation
 */


/**Capitalizes the first letter */
export function capitalizeFirst(s:string) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}