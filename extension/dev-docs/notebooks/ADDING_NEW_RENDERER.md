# Adding New Renderer

Adding a new renderer is relatively straight forward, but has some boilerplate steps that need to be followed.

> Pro tip: To develop renderers, run `npm run start-notebook`

## Update Types and IDL Logic

1. In `idlnotebook__define` add an appropriate new structure type for the output that you want to render

2. Update the `IDLNotebook::AddToNotebook` method to perform any validation of the data and track

This is automatically exported after a cell does it's thing via the notebook controller

3. Add a new embed type and data structure to `libs/notebooks/types/src/lib/idl-notebook-embedded.interface.ts`

Make sure to follow naming pattern for other embed types and expose at the bottom as well.

## Add New Renderer Component

This is where we will walk through creating and registering a new Angular component.

1. Using the NX CLI, create a new component.

> Pro tip: Use the NX VSCode extension to help
>
> Install, then open the NX sidebar, and select "generate"
>
> Pick `@nx/angular - component`
>
> Set the name
>
> Pick `notebook-components` as the project
>
> Set export as true
>
> Use the advanced option of path and specify `apps/notebook/components/src/app/components`

```shell
npx nx generate @nx/angular:component --name=new-renderer --project=notebook-components --export=true --path=apps/notebook/components/src/app/components
```

> IMPORTANT NOTE: Delete the .scss file that is generated and update the `component.ts` file to use `styles` instead of `styleUri` like our other components do
>
> We need to do this because we can't include styles through the file (we need to use the embedded styles directly)
>
> This way everything is bundled together and is what worked to get the pattern established for creating components

2. Update the new component to inherit from our BaseComponent like `apps/notebook/components/src/app/components/image/image.component.ts`

This makes sure all components have the same inputs for getting data and have access to the VSCode messenger API

This also normalizes properties for our renderers (such as adding a "hasData" property)

They also have a property "canMessage" that can be used to turn on/off elements in the UI

3. Set the HTML for the new component to follow the pattern:

```html
<div *ngIf="hasData; then thenBlock; else elseBlock"></div>

<ng-template #thenBlock>
  <p>Add rendering logic here!</p>
</ng-template>

<ng-template #elseBlock>
  <p>No content to render</p>
</ng-template>
```

4. Update the switch statement to register the new renderer in this file `apps/notebook/components/src/app/components/entry/entry.component.html`

5. Run a notebook, make the output, render and visualize the output!

> Make sure to save the notebook so it is easy to develop and view changes

6. Make changes to code, wait for compile, then refresh dev window to see results!

> Make sure to set your styles appropriately in the element! Test with the notebooks being small and full-screen.
>
> You may need to set max-sizes along with percentages for best small/large visuals
>
> Additionally, the pattern is that all content is top-left aligned and doesn't center
