# Pop-up dialogs, modals and utilities

## `Popup`

Basically a white box with a close button that accepts slotted content. This component is supposed to be imported in your own popup component and your popup content to be wrapped with.

**Properties**

`closeButton` - Whether to show a close button. `false` by default. Enabling this can be handy when you need a close button
consistent with the rest of the application. The button fires a `close` event when clicked, which can be handled by the `on:close` svelte construct.

**Events**

`close` - Fired when the close button of the popup is clicked. This button can be enabled through the `closeButton` property. Useful for binding the `closePopup` function provided by the popup utilities.

## `Modal`

Modal is responsible for placement and control of content that needs to be displayed over other application content. Modal is mainly used for placing popups in the app, ensures having consistent popup transitions and behavior across the app and a dimm background to the slotted content.

**Events**

`close` - fired when the user clicks outside of the slotted content. Useful for binding the `closePopup` function provided by the popup utilities.

## `PopupManager`

A component that comunicates nicely with the popup utilities in `utils/popup` and renders the popups that are set through the utilities.

Popup manager is supposed to be placed at the root level of a layout file.

Clicking outside the popup managed by the popup manager will attempt to close the popup on top of the popup stack.

## Pop-up and modal utilities

### `setPopup`

`setPopup(component: any, options: PopupOptions)`

Set a popup component with this function. The component will be added to the popup stack and rendered by the popup manager. A popup handler object will be returned. This popup handler will also be passed to the popup component itself, which can then access its methods (like `close`).

_Note: This function manipulates the `popupStack` store, which is not meant to be used directly._

**Parameters**

`component` - an imported svelte component file.

#### `options`

| Property  | Description                                                                                                                                                              |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`      | A unique id for the popup. This is used to identify the popup in the popup manager. Will be automatically generated when not explicitly specified.                       |
| `unique`  | If `true` and a instance of `component` already exists, no new popup will be created. `false` by default.                                                                |
| `onClose` | A callback function that will be called when the popup is closed. This function should return a boolean value saying whether the popup should actually be closed or not. |
| `props`   | A object with properties that will be passed to the instance of `component`.                                                                                             |

**Example**

Assuming `DuckPopup` can accept properties `numberOfDucks` and `duckSound`:

```ts
import DuckPopup from '$lib/components/DuckPopup.svelte';
import { setPopup } from '$utils/popup';

const handler = setPopup(DuckPopup, {
	id: `duck-popup`,
	unique: true,
	props: { numberOfDucks: 123, duckSound: 'Quack!' },
	onClose: () => {
		console.log('Closing the popup');
		return true;
	}
});

handler.close();
```

#### `PopupHandler`

Popup handler is returned by the `setPopup` function and also passed to the popup component itself, which can then access its methods (like `close`).

| Property  | Description          |
| --------- | -------------------- |
| `id`      | The id of the popup. |
| `close()` | Closes the popup.    |

### `existsInstanceOfPopup`

**Parameters**

Checks whether an instance of the given popup component already exists.

- `component` - an imported svelte component file.

**Returns**

A boolean value indicating whether an instance of the given component already exists.

### `closePopup`

Closes the popup with the given ID or the popup at the top of the stack if an ID is not given. Please try to use popup handlers instead of this function.

**Parameters**

- `id` (optional) - the id of the popup to close.
