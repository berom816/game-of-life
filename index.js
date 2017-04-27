'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//look at surrounding 8 neighbor cells, returns amount of alive neighbors
//border cells have less than 8 neighbors
function getAliveNeighbors(arr, i) {
  var numberOfRows = 30;
  var numberOfColumns = 50;
  //arrays to store cell indexs that are on left most column and right most column
  var leftEdge = [];
  var rightEdge = [];
  var aliveNeighbors = 0;
  //push in the indexes of left most column
  for (var f = 0; f < numberOfRows * numberOfColumns; f += numberOfColumns) {
    leftEdge.push(f);
  }
  //push in the indexes of right most column
  for (var r = numberOfColumns - 1; r < numberOfRows * numberOfColumns; r += numberOfColumns) {
    rightEdge.push(r);
  }

  //look at top-left neighbor, won't have top left neighbor if current cell is on left-most column or top row
  if (i - numberOfColumns - 1 >= 0 && !leftEdge.includes(i)) {
    if (arr[i - numberOfColumns - 1].alive) {
      aliveNeighbors++;
    }
  }

  //look at top neighbor, won't have top neighbor if current cell is on top-most row
  if (i - numberOfColumns >= 0) {
    if (arr[i - numberOfColumns].alive) {
      aliveNeighbors++;
    }
  }

  //look at top-right neighbor, won't have top right neighbor if current cell is on right-most column or top row
  if (i - numberOfColumns + 1 >= 0 && !rightEdge.includes(i)) {
    if (arr[i - numberOfColumns + 1].alive) {
      aliveNeighbors++;
    }
  }

  //look at left neighbor, won't have left neighbor if current cell is on left-most column
  if (!leftEdge.includes(i)) {
    if (arr[i - 1].alive) {
      aliveNeighbors++;
    }
  }

  //look at right neighbor, won't have right neighbor if current cell is on right-most column
  if (!rightEdge.includes(i)) {
    if (arr[i + 1].alive) {
      aliveNeighbors++;
    }
  }

  //look at bottom-left neighbor, won't have bottom-left neighbor if current cell is on left-most column or lowest row
  if (i + numberOfColumns - 1 < numberOfRows * numberOfColumns && !leftEdge.includes(i)) {
    if (arr[i + numberOfColumns - 1].alive) {
      aliveNeighbors++;
    }
  }

  //look at bottom neighbor, won't have bottom neighbor if current cell is on lowest row
  if (i + numberOfColumns < numberOfRows * numberOfColumns) {
    if (arr[i + numberOfColumns].alive) {
      aliveNeighbors++;
    }
  }

  //look at bottom-right neighbor, won't have bottom-right neighbor if current cell is on right-most column or lowest row
  if (i + numberOfColumns + 1 < numberOfRows * numberOfColumns && !rightEdge.includes(i)) {
    if (arr[i + numberOfColumns + 1].alive) {
      aliveNeighbors++;
    }
  }

  return aliveNeighbors;
}

//display function returning game message and creator credit
function getFooter() {
  return React.createElement(
    'div',
    { className: 'footer' },
    'Click on a cell to make it come alive',
    React.createElement('br', null),
    'Click ',
    React.createElement(
      'a',
      { href: 'https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life', target: '_blank' },
      'here'
    ),
    ' for more information on Game of Life',
    React.createElement('br', null),
    'Created by BXR'
  );
}

//component, create a cell(one square) of a board(grid)

var Cell = function (_React$Component) {
  _inherits(Cell, _React$Component);

  function Cell() {
    _classCallCheck(this, Cell);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.handleAliveness = _this.handleAliveness.bind(_this);
    return _this;
  }

  //when cell is clicked, handler function of changeAliveness

  Cell.prototype.handleAliveness = function handleAliveness() {
    this.props.changeAliveness(this.props.index, this.props.alive);
  };

  //if passed in cellObj is alive render with aliveCell which have green background color

  Cell.prototype.render = function render() {
    if (this.props.alive) {
      return React.createElement('div', { className: 'aliveCell', onClick: this.handleAliveness });
    } else {
      return React.createElement('div', { className: 'deadCell', onClick: this.handleAliveness });
    }
  };

  return Cell;
}(React.Component);

//component, grid is composed of many cells

var Grid = function (_React$Component2) {
  _inherits(Grid, _React$Component2);

  function Grid() {
    _classCallCheck(this, Grid);

    var _this2 = _possibleConstructorReturn(this, _React$Component2.call(this));

    _this2.forEachCell = _this2.forEachCell.bind(_this2);
    return _this2;
  }

  //create cell component for each index of cellPopulation passed in

  Grid.prototype.forEachCell = function forEachCell(cell, i) {
    return React.createElement(Cell, { index: i, alive: cell.alive, changeAliveness: this.props.changeAliveness });
  };

  Grid.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'grid' },
      this.props.cellPopulation.map(this.forEachCell)
    );
  };

  return Grid;
}(React.Component);

//componenet, controlls initialization and running of the game

var Game = function (_React$Component3) {
  _inherits(Game, _React$Component3);

  function Game() {
    _classCallCheck(this, Game);

    //start with generation 0, and initialize cellPopulation
    //cellPopulation will be an array containing objects with property of 'index', 'alive' and 'nextGenStatus'

    var _this3 = _possibleConstructorReturn(this, _React$Component3.call(this));

    _this3.state = {
      generation: 0,
      cellPopulation: _this3.initializeCells()
    };
    _this3.initializeCells = _this3.initializeCells.bind(_this3);
    _this3.determineNextGenLife = _this3.determineNextGenLife.bind(_this3);
    _this3.goToNextGen = _this3.goToNextGen.bind(_this3);
    _this3.stopGame = _this3.stopGame.bind(_this3);
    _this3.startGame = _this3.startGame.bind(_this3);
    _this3.changeAliveness = _this3.changeAliveness.bind(_this3);
    _this3.clearBoard = _this3.clearBoard.bind(_this3);
    return _this3;
  }

  //returns an array of cellObj
  //each cellObj have property 'index', 'alive' and 'nextGenStatus'

  Game.prototype.initializeCells = function initializeCells() {
    var cellArr = [];
    for (var a = 0; a < 1500; a++) {
      var cellObj = {};
      //randomly decide whether this cellObj will be alive or not
      if (Math.floor(Math.random() * 2) === 1) {
        cellObj.alive = true;
      } else {
        cellObj.alive = false;
      }
      //nextGenStatus starts off as null
      cellObj.nextGenStatus = null;
      cellObj.index = a;
      cellArr.push(cellObj);
    }
    return cellArr;
  };

  //after components had mounted, start interval invoke of goToNextGen

  Game.prototype.componentDidMount = function componentDidMount() {
    this.timer = setInterval(this.goToNextGen, 200);
  };

  //updates the state generation and cellPopulation array
  //generation will be increase by 1 each time
  //cellPpulation will have each cellObj's property alive value set to its nextGenStatus value

  Game.prototype.goToNextGen = function goToNextGen() {
    var newArr = this.determineNextGenLife(this.state.cellPopulation);
    var tempArr = newArr;
    for (var i = 0; i < tempArr.length; i++) {
      tempArr[i].alive = tempArr[i].nextGenStatus;
    }
    //update state for rendering
    this.setState({
      //some reason shorthand generation++ doesn't work
      generation: this.state.generation + 1,
      cellPopulation: tempArr
    });
  };

  //function used to determine each cell's next generation status
  //will be passed in the current cellPopulation array
  //returns updated array

  Game.prototype.determineNextGenLife = function determineNextGenLife(arr) {
    for (var i = 0; i < arr.length; i++) {
      //get the amount alive neighbors surrounding the current cellObj
      var aliveNeighbors = getAliveNeighbors(arr, i);
      if (arr[i].alive) {
        //if current cell is alive and have 2 or 3 alive neighbors
        if (aliveNeighbors === 2 || aliveNeighbors === 3) {
          //current cell will stay alive in next generation
          arr[i].nextGenStatus = true;
        } else {
          arr[i].nextGenStatus = false;
        }
      } else {
        //if current cell is dead but have 3 alive neighbors
        if (aliveNeighbors === 3) {
          //it becomes alive in the next generation
          arr[i].nextGenStatus = true;
        } else {
          arr[i].nextGenStatus = false;
        }
      }
    }
    return arr;
  };

  //start or continue the game by interval invoke of goToNextGen

  Game.prototype.startGame = function startGame() {
    this.timer = setInterval(this.goToNextGen, 200);
  };

  //function to clear away the interval invoke , thus stopping the grid rendering

  Game.prototype.stopGame = function stopGame() {
    clearInterval(this.timer);
  };

  //clear the board of alive cells,reset generation and game

  Game.prototype.clearBoard = function clearBoard() {
    //stop interval call through timer
    clearInterval(this.timer);
    var arr = this.state.cellPopulation;
    for (var a = 0; a < arr.length; a++) {
      arr[a].alive = false;
      arr[a].nextGenStatus = null;
    }
    this.setState({
      generation: 0,
      cellPopulation: arr
    });
  };

  //when called, change the alive property of cellObj at passed in index of cellPopulation to opposite of what it is, update state to re-render

  Game.prototype.changeAliveness = function changeAliveness(index, aliveness) {
    var arr = this.state.cellPopulation;
    arr[index].alive = !aliveness;
    this.setState({
      cellPopulation: arr
    });
  };

  //when component remove from DOM, remove the interval call

  Game.prototype.componentWillUnmount = function componentWillUnmount() {
    clearInterval(this.timer);
  };

  Game.prototype.render = function render() {
    return React.createElement(
      'div',
      { className: 'gameDisplay' },
      React.createElement(
        'div',
        { className: 'controlDisplay' },
        React.createElement(
          'button',
          { onClick: this.startGame },
          'Start'
        ),
        React.createElement(
          'button',
          { onClick: this.stopGame },
          'Stop'
        ),
        React.createElement(
          'button',
          { onClick: this.goToNextGen },
          'Next'
        ),
        React.createElement(
          'button',
          { onClick: this.clearBoard },
          'Clear'
        ),
        React.createElement(
          'span',
          { className: 'generationDisplay' },
          'Generation: ',
          React.createElement(
            'div',
            { className: 'generationCounter' },
            this.state.generation
          )
        )
      ),
      React.createElement(Grid, { cellPopulation: this.state.cellPopulation, changeAliveness: this.changeAliveness })
    );
  };

  return Game;
}(React.Component);

//component to put together all the components for final display

var App = function (_React$Component4) {
  _inherits(App, _React$Component4);

  function App() {
    _classCallCheck(this, App);

    return _possibleConstructorReturn(this, _React$Component4.call(this));
  }

  App.prototype.render = function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'title' },
        'Game of Life'
      ),
      React.createElement(Game, null),
      getFooter()
    );
  };

  return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));