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
- fetch all nfts on user wallet (potential approaches - use moralis or subgraph for nfts not on the hinata marketplace)
- have airdrop popup show relevant data
- ensure users that can access private page have access to it
- implement staking contract (using total amount of user's balance)
- read waifu rewards balance from staking contract
- prevent access to private page for users without balances in respective contracts/wallets
- reenable private page access

## Documentation

- [Authentication](./docs//authentication.md)
- [Hover hints](./docs/hover-hints.md)
- [Popups & modal utilities](./docs/popup-modal-utils.md)
