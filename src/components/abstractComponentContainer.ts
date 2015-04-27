///<reference path="../reference.ts" />

module Plottable {
  /*
   * ComponentContainer class encapsulates Table and ComponentGroup's shared functionality.
   * It will not do anything if instantiated directly.
   */
  export class ComponentContainer extends Component {
    private _components: Component[] = [];

    public _addComponent(c: Component, prepend = false): boolean {
      if (!c || this._components.indexOf(c) >= 0) {
        return false;
      }

      if (prepend) {
        this.components().unshift(c);
      } else {
        this.components().push(c);
      }
      c.parent(this);
      if (this._isAnchored) {
        c.anchor(this._content);
      }
      this.invalidateLayout();
      return true;
    }

    public anchor(element: D3.Selection) {
      super.anchor(element);
      this.components().forEach((c) => c.anchor(this._content));
    }

    /**
     * Returns a list of components in the ComponentContainer.
     *
     * @returns {Component[]} the contained Components
     */
    public components(): Component[] {
      return this._components;
    }

    /**
     * Detaches all components contained in the ComponentContainer, and
     * empties the ComponentContainer.
     *
     * @returns {ComponentContainer} The calling ComponentContainer
     */
    public detachAll() {
      // Calling c.remove() will mutate this._components because the component will call this._parent._removeComponent(this)
      // Since mutating an array while iterating over it is dangerous, we instead iterate over a copy generated by Arr.slice()
      this.components().slice().forEach((c: Component) => c.detach());
      return this;
    }

    /**
     * Returns true iff the ComponentContainer is empty.
     *
     * @returns {boolean} Whether the calling ComponentContainer is empty.
     */
    public empty() {
      return this._components.length === 0;
    }

    public remove() {
      super.remove();
      this.components().slice().forEach((c: Component) => c.remove());
    }

    public removeComponent(c: Component) {
      var removeIndex = this._components.indexOf(c);
      if (removeIndex >= 0) {
        this.components().splice(removeIndex, 1);
        this.invalidateLayout();
      }
    }

    public render() {
      this._components.forEach((c) => c.render());
    }

    public useLastCalculatedLayout(): boolean;
    public useLastCalculatedLayout(calculated: boolean): Component;
    public useLastCalculatedLayout(calculated?: boolean): any {
      if (calculated != null) {
        this.components().slice().forEach((c: Component) => c.useLastCalculatedLayout(calculated));
      }
      return super.useLastCalculatedLayout(calculated);
    }
  }
}
