import React, { Component } from 'react';
import './App.css';

// note: extending Component because it is imported separately

class Square extends Component {

  render() {
    return (
      // style={selectSquareStyle(this.props.squaresStatus[this.props.id])}
    <button className="square" onClick={this.props.clickSquare} id={this.props.id} style={selectSquareStyle(this.props.squaresStatus[this.props.id],this.props.gameState)}></button>
    );
  }
}

class Board extends Component {
  renderSquare(i) {
    return <Square id={i} squaresStatus={this.props.squaresStatus} clickSquare={this.props.clickSquare} gameState={this.props.gameState}/>;
  }
  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
        </div>
        <div className="board-row">
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
        </div>
        <div className="board-row">
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
        </div>
      </div>
    );
  }
}

class Footer extends Component {
  render() {

    let footerTag = null;

    switch (this.props.gameState) {
      case 'start':
        footerTag = <button onClick={this.props.setBoard}>Start Game</button>;
        break;
      case 'setBoard':
        break;
      case 'getReady':
        footerTag = <p>Get ready to memorize in {this.props.timeLeft}</p>;
        break;
      case 'guess':
        footerTag = <p>Guess the correct cells!</p>;
        break;
      case 'playAgain':
        footerTag = <button onClick={this.props.playAgain}>Play Again</button>;
        break;
    }

    return (
      <div>
        {footerTag}
      </div>
    );
  }
}

class App extends Component {

  constructor (props) {
    super(props); 
    this.state = {
      squaresStatus: generateSquares(),
      gameState: 'start',
      timeLeft: 3                
    }

    this.clickSquare = this.clickSquare.bind(this);
    this.highlightSquares = this.highlightSquares.bind(this);
    this.countdown = this.countdown.bind(this);
    this.setBoard = this.setBoard.bind(this);
    this.showResults = this.showResults.bind(this);
    this.playAgain = this.playAgain.bind(this);

  }

  clickSquare(event) {

    // change squareStatus to clicked
    let tempArr = this.state.squaresStatus;
    tempArr[event.target.id].clicked = true;
    this.setState({squaresStatus: tempArr});

  }

  countdown() {
    this.setState({gameState: 'getReady'});

    let startingPoint = 3;

    let timer = setInterval(function() {

      let current = this.state.timeLeft;
      console.log(current);
      let distance = startingPoint - current;

      this.setState({timeLeft: this.state.timeLeft-1});

    }.bind(this), 1000);

    setTimeout(() => { clearInterval(timer); this.highlightSquares(); }, 3000);

  }

  setBoard() {
   this.countdown();
   //this.highlightSquares();
  }

  highlightSquares() {

    let posArr = [];

    // select four random squares to highlight
    for (let i = 0; i < 4; i++){
      let position = getRandom(this.state.squaresStatus);
      while (contains(posArr, position)) {
        position = getRandom(this.state.squaresStatus);
      }
      posArr.push(position);
    }

    console.log(posArr);

    // map new arr & set highlight property
    let newArr = this.state.squaresStatus.map((current, index) => {
      let newObj = current;
      for (let j = 0; j < posArr.length; j++){
        if (posArr[j] === index) {
          newObj.highlighted = true;
        }
      }
      return newObj;
    });

    console.log(newArr);

    // update state
    this.setState({squaresStatus: newArr, gameState: 'setBoard'});
    setTimeout(function(){ this.setState({gameState: 'guess'}) }.bind(this), 201);

    setTimeout(this.showResults,3000);

  }

  showResults() {
    this.setState({gameState: 'playAgain'});
  }

  playAgain() {
    this.setState({squaresStatus: generateSquares(), gameState: 'getReady', timeLeft: 3 }, function () {
     this.setBoard();
    });
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Memory Game</h1>
        </header>
        <Board gameState={this.state.gameState} squaresStatus={this.state.squaresStatus} clickSquare={this.clickSquare}/>
        <br />
        <Footer gameState={this.state.gameState} playAgain={this.playAgain} timeLeft={this.state.timeLeft} setBoard={this.setBoard}/>
      </div>
    );
  }
}

class squareStatus {
  constructor() {
    this.highlighted = false;
    this.clicked = false;
  }
}

const generateSquares = () => {
    let arr = [];
    for (let i = 0; i < 12; i++) {
      arr.push(new squareStatus());
    }
    console.log(arr);
    return arr;
  }

const getRandom = (arr) => {
  return Math.floor(Math.random() * arr.length);
}

const contains = (arr, val) => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === val){
      return true;
    }
  }
  return false;
}

const selectSquareStyle = (squareObj, gameState) => {

    let styleObj = {};

    if (gameState === 'setBoard' && squareObj.highlighted === true) {
      styleObj['backgroundColor'] = '#B0C4DE';
    } else if (gameState === 'playAgain') {
        console.log(squareObj);
      if (squareObj.highlighted === true && squareObj.clicked === true){
        styleObj['backgroundColor'] = '#91d66f';
      } else if (squareObj.highlighted === true && squareObj.clicked === false){
        styleObj['backgroundColor'] = '#f2ef6a';
      } else if (squareObj.highlighted === false && squareObj.clicked === true){
        styleObj['backgroundColor'] = '#d82b39';
      } 
    }

    return styleObj;

  }

export default App;
