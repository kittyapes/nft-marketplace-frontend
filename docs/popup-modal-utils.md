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

## Pop-up and modal utilities

### `setPopup`

`setPopup(component: any, options: PopupOptions)`

Set a popup component with this function. The component will then be rendered by a popup manager.

_Note: This function manipulates the `popupComponent` and `popupOptions` stores, which are not recommended to be set manually._

**Parameters**

`component` - an imported svelte component file.

`options` - at this moment only passes down props to your custom popup component (which is specified by the `component` parameter). See example below with a `message` property and a custom `onClose` handler called by your custom popup component.

```ts
{
    props: { message: "I am a cool popup.", onClose: () => ... }
}
```

**Example**

Assuming `DuckPopup` can accept properties `numberOfDucks` and `duckSound`...

```ts
import DuckPopup from '$lib/components/DuckPopup.svelte';
import { setPopup } from '$utils/popup';

setPopup(DuckPopup, { props: { numberOfDucks: 123, duckSound: 'Quack!' } });
```

### `closePopup`

`closePopup()`

Resets the `popupComponent` store, effectively removing the popup from the screen. Note that this function does not reset the `popupOptions` store, because resetting this store could cause the popup to flicker with undefined data.
