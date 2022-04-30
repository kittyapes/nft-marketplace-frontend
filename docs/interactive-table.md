# Interactive Table Component
Whenever a table of some kind needs to be created, it is recommended to use the `InteractiveTable.svelte` component.

To give our component the data in needs we need to give it props of the `TableCol` type and usually you would use it as an array to define multiple rows.
```ts
export interface TableCol {
    gridSize: string
    renderComponent: any,
    titleRenderComponent: any,
    renderComponentProps?: 
        {
            [key: string]: any
        }[],
    titleRenderComponentProps?: {
        [key: string]: any
    },
}
```
To go over the meaning in this type definition:
* gridSize - a string which dictates how large should this column be, ex: `'400px'`, `'3fr'`, ... (anything that can be used in `style.gridTemplateColumns`
* renderComponent - a component which represents the individual cells of the column in the table
* renderComponentProps (optional) - props for the `renderComponent` component, as an array for multiple rows 
* titleRenderComponent - a component which represents the header cell of the column in the table
* titleRenderComponentProps (optional) - props for the `titleRenderComponent` component

The table also has a optional prop of `rows` which is used for when you don't want to define any `renderComponentProps`. In that case the table needs to know how many
rows will it have.

In your render components you can dispatch events with the name `event` and they will be forwarded to wherever you are using the `InteractiveTable` component.

