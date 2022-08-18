import {BootstrapColors} from "@/constants/bootstrap"

/**
 * Used for getting colors for list of badges to make it more colorful
 * @param idx {number} Index of color. Can be any size.
 * @returns {string} CSS class for color to be used on badge
 */
export function getBadgeColor(idx) {
	return BootstrapColors[idx % BootstrapColors.length]
}
