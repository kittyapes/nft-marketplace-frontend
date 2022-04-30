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