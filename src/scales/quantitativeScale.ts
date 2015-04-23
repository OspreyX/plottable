///<reference path="../reference.ts" />

module Plottable {
export module Scale {
  export class AbstractQuantitative<D> extends AbstractScale<D, number> {
    protected _d3Scale: D3.Scale.QuantitativeScale;
    private _numTicks = 10;
    private _PADDING_FOR_IDENTICAL_DOMAIN = 1;
    public _userSetDomainer: boolean = false;
    private _domainer: Domainer = new Domainer();
    public _typeCoercer = (d: any) => +d;
    private _tickGenerator: TickGenerators.TickGenerator<D> = (scale: Plottable.Scale.AbstractQuantitative<D>) => scale.getDefaultTicks();

    /**
     * Constructs a new QuantitativeScale.
     *
     * A QuantitativeScale is a Scale that maps anys to numbers. It
     * is invertible and continuous.
     *
     * @constructor
     * @param {D3.Scale.QuantitativeScale} scale The D3 QuantitativeScale
     * backing the QuantitativeScale.
     */
    constructor(scale: D3.Scale.QuantitativeScale) {
      super(scale);
    }

    protected _getExtent(): D[] {
      return this._domainer.computeDomain(this._getAllExtents(), this);
    }

    /**
     * Retrieves the domain value corresponding to a supplied range value.
     *
     * @param {number} value: A value from the Scale's range.
     * @returns {D} The domain value corresponding to the supplied range value.
     */
    public invert(value: number): D {
      return <any> this._d3Scale.invert(value);
    }

    /**
     * Creates a copy of the QuantitativeScale with the same domain and range but without any registered list.
     *
     * @returns {AbstractQuantitative} A copy of the calling QuantitativeScale.
     */
    public copy(): AbstractQuantitative<D> {
      return new AbstractQuantitative<D>(this._d3Scale.copy());
    }

    public domain(): D[];
    public domain(values: D[]): AbstractQuantitative<D>;
    public domain(values?: D[]): any {
      return super.domain(values); // need to override type sig to enable method chaining :/
    }

    protected _setDomain(values: D[]) {
        var isNaNOrInfinity = (x: any) => x !== x || x === Infinity || x === -Infinity;
        if (isNaNOrInfinity(values[0]) || isNaNOrInfinity(values[1])) {
            _Util.Methods.warn("Warning: QuantitativeScales cannot take NaN or Infinity as a domain value. Ignoring.");
            return;
        }
        super._setDomain(values);
    }

    /**
     * Sets or gets the QuantitativeScale's output interpolator
     *
     * @param {D3.Transition.Interpolate} [factory] The output interpolator to use.
     * @returns {D3.Transition.Interpolate|AbstractQuantitative} The current output interpolator, or the calling QuantitativeScale.
     */
    public interpolate(): D3.Transition.Interpolate;
    public interpolate(factory: D3.Transition.Interpolate): AbstractQuantitative<D>;
    public interpolate(factory?: D3.Transition.Interpolate): any {
      if (factory == null) {
        return this._d3Scale.interpolate();
      }
      this._d3Scale.interpolate(factory);
      return this;
    }

    /**
     * Sets the range of the QuantitativeScale and sets the interpolator to d3.interpolateRound.
     *
     * @param {number[]} values The new range value for the range.
     */
    public rangeRound(values: number[]) {
      this._d3Scale.rangeRound(values);
      return this;
    }

    /**
     * Gets ticks generated by the default algorithm.
     */
    public getDefaultTicks(): D[] {
        return this._d3Scale.ticks(this.numTicks());
    }

    /**
     * Gets the clamp status of the QuantitativeScale (whether to cut off values outside the ouput range).
     *
     * @returns {boolean} The current clamp status.
     */
    public clamp(): boolean;
    /**
     * Sets the clamp status of the QuantitativeScale (whether to cut off values outside the ouput range).
     *
     * @param {boolean} clamp Whether or not to clamp the QuantitativeScale.
     * @returns {AbstractQuantitative} The calling QuantitativeScale.
     */
    public clamp(clamp: boolean): AbstractQuantitative<D>;
    public clamp(clamp?: boolean): any {
      if (clamp == null) {
        return this._d3Scale.clamp();
      }
      this._d3Scale.clamp(clamp);
      return this;
    }

    /**
     * Gets a set of tick values spanning the domain.
     *
     * @returns {any[]} The generated ticks.
     */
    public ticks(): any[] {
      return this._tickGenerator(this);
    }

    /**
     * Gets the default number of ticks.
     *
     * @returns {number} The default number of ticks.
     */
    public numTicks(): number;
    /**
     * Sets the default number of ticks to generate.
     *
     * @param {number} count The new default number of ticks.
     * @returns {Quantitative} The calling QuantitativeScale.
     */
    public numTicks(count: number): AbstractQuantitative<D>;
    public numTicks(count?: number): any {
      if (count == null) {
        return this._numTicks;
      }
      this._numTicks = count;
      return this;
    }

    /**
     * Given a domain, expands its domain onto "nice" values, e.g. whole
     * numbers.
     */
    public _niceDomain(domain: any[], count?: number): any[] {
      return this._d3Scale.copy().domain(domain).nice(count).domain();
    }

    /**
     * Gets a Domainer of a scale. A Domainer is responsible for combining
     * multiple extents into a single domain.
     *
     * @return {Domainer} The scale's current domainer.
     */
    public domainer(): Domainer;
    /**
     * Sets a Domainer of a scale. A Domainer is responsible for combining
     * multiple extents into a single domain.
     *
     * When you set domainer, we assume that you know what you want the domain
     * to look like better that we do. Ensuring that the domain is padded,
     * includes 0, etc., will be the responsability of the new domainer.
     *
     * @param {Domainer} domainer If provided, the new domainer.
     * @return {AbstractQuantitative} The calling QuantitativeScale.
     */
    public domainer(domainer: Domainer): AbstractQuantitative<D>;
    public domainer(domainer?: Domainer): any {
      if (domainer == null) {
        return this._domainer;
      } else {
        this._domainer = domainer;
        this._userSetDomainer = true;
        this._autoDomainIfAutomaticMode();
        return this;
      }
    }

    public _defaultExtent(): any[] {
      return [0, 1];
    }

    /**
     * Gets the tick generator of the AbstractQuantitative.
     *
     * @returns {TickGenerator} The current tick generator.
     */
    public tickGenerator(): TickGenerators.TickGenerator<D>;
    /**
     * Sets a tick generator
     *
     * @param {TickGenerator} generator, the new tick generator.
     * @return {AbstractQuantitative} The calling AbstractQuantitative.
     */
    public tickGenerator(generator: TickGenerators.TickGenerator<D>): AbstractQuantitative<D>;
    public tickGenerator(generator?: TickGenerators.TickGenerator<D>): any {
      if(generator == null) {
        return this._tickGenerator;
      } else {
        this._tickGenerator = generator;
        return this;
      }
    }
  }
}
}
