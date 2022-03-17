# Authentication

If authentication is required for a certain feature, it is recommended that we ask the user to sign a message before accessing the route
that embeds such feature.

Checking whether the auth token is expired can be done in the following way:

```ts
import { isAuthTokenExpired } from '$utils/auth/token';

// In a click handler that takes us to the route...
if (isAuthTokenExpired()) {
	// Don't go to the route.
} else {
	// Go to the route.
}
```

At the same time, we probably wanna display a popup that will requrest the user to sign a message, which will then allow us to get an auth token.

A popup like this is implemented and handled in `src/utils/navigation/index.ts`. We can automatically have the popup invoked by adding a regex pattern of the route that requires auth to the `authRequiredRoutes` list. (_hardcode it in_)
