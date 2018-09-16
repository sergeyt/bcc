import Immutable from 'immutable';
import React, { Component } from 'react';
import { DrizzleContext } from 'drizzle-react';
import math from 'mathjs';

import Button from './Button';
import './App.css';

const Display = ({data}) => {
    const str = data.toArray().join('');
    return <div className="display">{str}</div>;
};

// TODO display error

class App extends Component {
  state = {
    operations: Immutable.List(),
  };

  reset = () => {
    this.setState({operations: Immutable.List()});
  };

  push = (val) => () => {
    this.setState({
      operations: this.state.operations.push(val),
    });
  };

  eval = () => {
    const input = this.state.operations.toArray().join('');
    if (input) {
      this.props.eval(input)
        .then(({result}) => {
          this.setState({
            operations: Immutable.List.of(result),
          });
        });
    }
  };
  
  render() {
    return (
      <div className="App">
        <Display data={this.state.operations} />
        <div className="buttons">
          <Button label="C" onClick={this.reset} />
          <Button label="7" onClick={this.push('7')} />
          <Button label="4" onClick={this.push('4')} />
          <Button label="1" onClick={this.push('1')} />
          <Button label="0" onClick={this.push('0')} />

          <Button label="/" onClick={this.push('/')} />
          <Button label="8" onClick={this.push('8')} />
          <Button label="5" onClick={this.push('5')} />
          <Button label="2" onClick={this.push('2')} />
          <Button label="." onClick={this.push('.')} />

          <Button label="x" onClick={this.push('*')} />
          <Button label="9" onClick={this.push('9')} />
          <Button label="6" onClick={this.push('6')} />
          <Button label="3" onClick={this.push('3')} />
          <Button className="non-interactive" label="" />

          <Button label="-" onClick={this.push('-')} />
          <Button label="+" size="2" onClick={this.push('+')} />
          <Button label="=" size="2" onClick={this.eval} />
        </div>
      </div>
    )
  }
}

function mathjsEval(input) {
  try {
    const value = math.eval(input);
    const result = math.format(value, { precision: 14 });
    return { result };
  } catch (err) {
    return Promise.reject(err);
  }
}

function makeEval(Calculator) {
  return input => {
    return Calculator.methods.eval(input).call()
      .then(value => ({ result: value }))
      .catch(err => {
        console.log(err);
        return mathjsEval(input);
      });
  };
}

export default () => (
  <DrizzleContext.Consumer>
    {drizzleContext => {
      const { drizzle, initialized } = drizzleContext;
  
      if (!initialized) {
        return "Loading...";
      }

      return (
        <App eval={makeEval(drizzle.contracts.Calculator)} />
      );
    }}
  </DrizzleContext.Consumer>
);
