import prob from 'prob.js';
export default class ExponentialDistribution {
  constructor(lambda){
    this._random = prob.exponential(lambda);
    this._max = 10;
    this._random.Max = this._max;
    this._min = 0.001;
    this._random.Min = this._min;
    this._lambda = lambda;
  }

  get min() {
    return this._min;
  }

  get max(){
    return this._max;
  }

  get random() {
    return this._random();
  }

  get mean(){
    return 1/this._lambda;
  }
}
