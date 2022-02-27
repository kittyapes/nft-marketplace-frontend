# Hover hints

Hints are preferably done by the `hoverHint` svelte action across the application, which can be imported from `$actions/hoverHint`.

Using the approach described in this file ensures consistency and global fixes/changes across the app.

# The `hoverHint` action

Apart from the required `node` parameter, the _Hover hint_ action accepts an options object with two properties: `text`, `targetId`.

The contents of `text` can either be a string or a HTML code. It will be inserted into the bubble as is. Inserting HTML elements is therefore entirely possible.

The action listens to the hover events on `node` and creates the hint bubble accordingly. The bubble is inserted inside an element targetted with `targedId`.

**Why the target element and `targetId`?**

The target element is required because in some cases, due to Svelte compiler optimizations, the functionality of certain components or even the DOM itself could break when inserting HTML after svelte compilation.

**Example**

```html
<script>
	import { hoverHint } from '$actions/hoverHint';
</script>

<div use:hoverHint="{{ text: 'I am a hint!', targetId: 'hint-target' }}">
	<!-- Having a hint target ensures that the switcher functionality doesn't break -->
	<div id="hint-target" />

	<HorizontailOptionSwitcher ... />
</div>
```
