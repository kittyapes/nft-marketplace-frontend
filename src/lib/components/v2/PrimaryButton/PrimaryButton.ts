export interface PrimaryButtonOptions {
	strokeBackground: string;
	innerOverlayBackground: string;
	innerOverlayBoxShadow: string;
	innerBackground: string;
}

export type PrimaryButtonVariant = 'default' | 'red' | 'green';

export const primaryButtonVariants: Record<PrimaryButtonVariant, Partial<PrimaryButtonOptions>> = {
	default: {
		strokeBackground:
			'linear-gradient(10deg, rgba(167, 148, 255, 0) 11.15%, rgba(167, 148, 255, 0.93) 57.47%, rgba(142, 119, 247, 0) 127.41%, rgba(142, 119, 247, 0) 127.41%, rgba(167, 148, 255, 0) 127.41%), linear-gradient(0deg, #67d4f8, #67d4f8)',
		innerOverlayBackground: `
            radial-gradient(55.65% 55.65% at 51.68% 130.43%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(55.22% 148.72% at 98.83% 0%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			radial-gradient(64.35% 166.74% at 8.56% -7.83%, rgba(103, 212, 248, 0.025) 0%, rgba(142, 119, 247, 0.025) 100%),
			linear-gradient(180deg, rgba(136, 234, 255, 0.1) 0%, rgba(133, 141, 247, 0.056) 100%, rgba(133, 141, 247, 0.1) 100%), rgba(0, 0, 0, 0.1);
        `,
		innerOverlayBoxShadow: `inset 0px 0px 17px rgba(120, 171, 248, 0.2)`,
		innerBackground: `#1d1832`,
	},
	red: {
		strokeBackground: `linear-gradient(90deg, #FF297C 0.46%, #F21E91 49.71%, #FC0363 100%)`,
		innerOverlayBackground: `linear-gradient(90deg, rgba(255, 41, 124, 0.1) 0.46%, rgba(242, 30, 145, 0.1) 49.71%, rgba(252, 3, 99, 0.1) 100%)`,
	},
	green: {
		strokeBackground: `linear-gradient(90deg, #ADFF00 0%, #4CEF00 51.68%, #59FF9C 101.25%)`,
		innerOverlayBackground: `linear-gradient(90deg, rgba(173, 255, 0, 0.3) 0%, rgba(76, 239, 0, 0.3) 51.68%, rgba(89, 255, 156, 0.3) 101.25%)`,
	},
};
