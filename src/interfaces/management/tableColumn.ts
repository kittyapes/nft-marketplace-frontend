export interface TableCol {
    name?: string;
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