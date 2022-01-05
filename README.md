# Hinata Frontend

## Installing dependencies

Please use `pnpm`.

```
pnpm install
```

## Scripts

- `dev`: Starts the dev server.
- `build`: Builds the project for vercel.
- `preview`: Previews the built project.

**Example**

```bash
pnpm dev
```

## Technologies used

- SvelteKit
- TailwindCSS

## Tailwind Configuration

### Colors

The following colors are used in the Tailwind CSS configuration.

- `color-black`
- `color-red`
- `color-blue`
- `color-purple`

A gradient color like the one in the designs can be achieved like this.

```html
<div class="h-10 bg-gradient-to-r from-color-purple to-color-blue" />
```

TODOS

- contract events (update balances after each event)
- confirm edit profile
- fetch all nfts on user wallet (potential approaches - use moralis or subgraph for nfts not on the hinata marketplace)
- escrow amounts for airdrop page
- fix links on airdrop page
- ensure links open on new page
- fix profile image
- ensure users that can access private page have access to it
- implement staking contract (using total amount of user's balance)
- read waifu rewards balance from staking contract
- prevent access to private page for users without balances in respective contracfts/wallets
- home page links updates