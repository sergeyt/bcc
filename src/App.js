import Immutable from 'immutable';
import React, { Component } from 'react';

import Button from './Button';
import './App.css';

const Display = ({data}) => {
    const str = data.toArray().join('');
    return <div className="display">{str}</div>;
};

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
    const formula = this.state.operations.toArray().join('');
    if (formula) {
      fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({formula}),
      })
      .then(resp => resp.json())
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

export default App;
