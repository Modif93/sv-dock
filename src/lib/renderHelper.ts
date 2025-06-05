import type { Component, ComponentProps, Snippet } from 'svelte';


/**
 * A helper class to make it easy to identify Svelte components
 */
export class RenderComponentConfig<TComponent extends Component> {
  component: TComponent;
  props: ComponentProps<TComponent> | Record<string, never>;
  constructor(
    component: TComponent,
    props: ComponentProps<TComponent> | Record<string, never> = {}
  ) {
    this.component = component;
    this.props = props;
  }
}

/**
 * A helper class to make it easy to identify Svelte Snippets
 */
export class RenderSnippetConfig<TProps> {
  snippet: Snippet<[TProps]>;
  params: TProps;
  constructor(snippet: Snippet<[TProps]>, params: TProps) {
    this.snippet = snippet;
    this.params = params;
  }
}

/**
 * A helper function to help create cells from Svelte components
 *
 * This is only to be used with Svelte Components - use `renderSnippet` for Svelte Snippets.
 *
 * @param component A Svelte component
 * @param props The props to pass to `component`
 * @returns A `RenderComponentConfig` object
 */
export function renderComponent<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Component<any>,
  Props extends ComponentProps<T>
>(component: T, props: Props) {
  return new RenderComponentConfig(component, props);
}

/**
 * The snippet must only take one parameter.
 *
 * This is only to be used with Snippets - use `renderComponent` for Svelte Components.
 *
 * @param snippet
 * @param params
 * @returns - A `RenderSnippetConfig` object that helps svelte-table know how to render the header/cell snippet.
 */
export function renderSnippet<TProps>(snippet: Snippet<[TProps]>, params: TProps) {
  return new RenderSnippetConfig(snippet, params);
}
