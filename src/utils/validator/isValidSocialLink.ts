import { SocialLinks, type Profile, type Config, TYPE_DESKTOP } from 'social-links';
import { isUrl, urlPattern } from './isUrl';

export type SupportedSocialNetworks = 'instagram' | 'discord' | 'twitter' | 'website' | 'pixiv' | 'deviantart' | 'artstation';

const config: Config = {
	usePredefinedProfiles: true,
	trimInput: true,
	allowQueryParams: true
};

const profileMatches: Profile[] = [
	{
		name: 'discord',
		matches: [
			{
				match: '(https?://)?(www.)?(discord.(gg|io|me|li|com)|discordapp.com/invite)/({PROFILE_ID})',
				group: 5,
				type: TYPE_DESKTOP,
				pattern: 'https://discord.com/{PROFILE_ID}'
			},
			{ match: '({PROFILE_ID})', group: 1 }
		]
	},
	{
		name: 'pixiv',
		matches: [
			{
				match: '(https?://)?(www.)?pixiv.net/users/({PROFILE_ID})',
				group: 3,
				type: TYPE_DESKTOP,
				pattern: 'https://www.pixiv.net/users/{PROFILE_ID}'
			},
			{ match: '({PROFILE_ID})', group: 1 }
		]
	},
	{
		name: 'deviantart',
		matches: [
			{
				match: '(https?://)?(www.)?deviantart.com/({PROFILE_ID})',
				group: 3,
				type: TYPE_DESKTOP,
				pattern: 'https://www.deviantart.com/{PROFILE_ID}'
			},
			{ match: '({PROFILE_ID})', group: 1 }
		]
	},
	{
		name: 'artstation',
		matches: [
			{
				match: '(https?://)?(www.)?artstation.com/({PROFILE_ID})',
				group: 3,
				type: TYPE_DESKTOP,
				pattern: 'https://www.artstation.com/{PROFILE_ID}'
			},
			{ match: '({PROFILE_ID})', group: 1 }
		]
	}
];

export default function (text: string, platform: SupportedSocialNetworks) {
	if (!text) {
		return {
			isValid: false,
			parsedValue: text
		};
	}

	if (platform === 'website') {
		return {
			isValid: urlPattern.test(text),
			parsedValue: text
		};
	} else {
		const socialLinks = new SocialLinks(config);
		profileMatches.forEach((profile) => socialLinks.addProfile(profile.name, profile.matches));

		const isValid = socialLinks.isValid(platform, text);

		return {
			isValid,
			parsedValue: socialLinks.getLink(platform, text)
		};
	}
}
