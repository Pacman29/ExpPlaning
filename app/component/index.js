import React from "react";
import ExponentialDistribution from "../services/exponentialDisribution";
import Model from "../services/model";
import math from 'mathjs'
import {FormControl} from "react-bootstrap";

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      queueDistribution: 1,
      autoDistribution: 1,
      requests: 10,
      solution: {
        b0: "",
        b1: "",
        b2: "",
        b3: "",
        T_real: "",
        T1: "",
        T2: "",
      }
    };
    this.calculate = this.calculate.bind(this);
    this.getSolution = this.getSolution.bind(this);
  }


  calculate(){
    let toNatural1 = (b,x1p,x1m,x2p,x2m) => {
      let a = [x1p + x1m, x1p - x1m, x2p + x2m, x2p - x2m];
      return [
        (b[0]*a[1]*a[3] - b[1]*a[3]*a[0] - b[2]*a[0]*a[2])/(a[1]*a[0]),
        2*b[1]/a[1],
        2*b[2]/a[3]
      ];
    };

    let toNatural2 = (b,x1p,x1m,x2p,x2m) => {
      let a = [x1p + x1m, x1p - x1m, x2p + x2m, x2p - x2m];
      return [
        (b[0]*a[1]*a[3] - b[1]*a[0]*a[3] - b[2]*a[2]*a[1] + b[3]*a[0]*a[2])/(a[1]*a[3]),
        2*(b[1]*a[3] - b[3]*a[2])/(a[1]*a[3]),
        2*(b[2]*a[1] - b[3]*a[0])/(a[1]*a[3]),
        4*b[3]/(a[1]*a[3])
      ];
    };

    let lambda = Number(this.state.queueDistribution);
    let muy = Number(this.state.autoDistribution);

    let Ed1 = new ExponentialDistribution(lambda);
    let Ed2 = new ExponentialDistribution(muy);


    console.log(Ed1.min);

    let N = Number(this.state.requests);
    let y = [];
    y[0] = Model.experiment(N,()=> Ed1.min,()=> Ed2.min);
    y[1] = Model.experiment(N,()=> Ed1.max,()=> Ed2.min);
    y[2] = Model.experiment(N,()=> Ed1.min,()=> Ed2.max);
    y[3] = Model.experiment(N,()=> Ed1.max,()=> Ed2.max);

    debugger;
    let b = [];
    b[0] = (y[0] + y[1] + y[2] + y[3])/4.0;
    b[1] = (-y[0] + y[1] - y[2] + y[3])/4.0;
    b[2] = (-y[0] - y[1] + y[2] + y[3])/4.0;
    b[3] = (y[0] - y[1] - y[2] + y[3])/4.0;

    let t_real = Model.experiment(N,()=> Ed1.random,()=> Ed2.random);
    let b2 = toNatural2(b,Ed1.max,Ed1.min,Ed2.max,Ed2.min);
    let b1 = toNatural1(b,Ed1.max,Ed1.min,Ed2.max,Ed2.min);
    let t1 = b1[0] + b1[1]*Ed1.mean + b1[2] * Ed2.mean;
    let t2 = b2[0] + b2[1]*Ed1.mean + b2[2] * Ed2.mean + b2[3]*Ed1.mean* Ed2.mean;

    this.setState({solution: {
        b0: b2[0],
        b1: b2[1],
        b2: b2[2],
        b3: b2[3],
        T_real: t_real,
        T1: t1,
        T2: t2
      }
    });
  }


  getSolution(){
    let results = [];
    Object.keys(this.state.solution).forEach(key => {
      results.push(
        <div key={key}>
          {`${key} : ${this.state.solution[key]}`}
        </div>
      );
    });
    return results;
  }

  render(){
    return (
      <div>
        <h3>Экспоненциальное распределение</h3>
        <div>
          <div>
            <span>
              Очередь:
              <FormControl
                className="form-control"
                type="text"
                value={this.state.queueDistribution}
                placeholder="Введите число"
                onChange={(e) => this.setState({queueDistribution : e.target.value })}
              />
            </span>
          </div>
          <div>
            <span>
              ОА:
              <FormControl
                className="form-control"
                type="text"
                value={this.state.autoDistribution}
                placeholder="Введите число"
                onChange={(e) => this.setState({autoDistribution : e.target.value })}
              />
            </span>
          </div>
          <div>
            <span>
              Колличество заявок:
              <FormControl
                className="form-control"
                type="text"
                value={this.state.requests}
                placeholder="Введите число"
                onChange={(e) => this.setState({requests : e.target.value })}
              />
            </span>
          </div>
          <button onClick={this.calculate}>Рассчитать</button>
        </div>
        <div>
          <h3>Результат: </h3>
          <div>
            {this.getSolution()}
          </div>
          <div id='plot'>

          </div>
        </div>
      </div>
    )
  }
}
