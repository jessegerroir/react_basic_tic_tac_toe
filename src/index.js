import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//the square object, squares comprise the board. Properties are passed in. This includes the onclick function.
//displays the variable 'square value'

function Square(props){
    return(
        <button className="square" onClick={props.onSquareClick}>
            {props.squareValue}
        </button>
    );
}

class Board extends React.Component {

    //constructor for the squares, specifies the onclick handler and value of squares defines names
    renderSquare(i) {
        return (
            <Square
                squareValue = {this.props.squares[i]}
                onSquareClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        //create and render the squares
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    //sets the initial variables pertaining to the game
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    //specifies the handler for the each squares being clicked, a reference to it gets passed down to each square
    //sets state of squares
    handleSquareClick(i){
        //increments the step number and adds it to the array
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length -1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    //sets the step and figures out if it's X or O
    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    //create and render the game board
    render() {
            const history = this.state.history;
            const current = history[this.state.stepNumber];
            const winner = calculateWinner(current.squares);

            const moves = history.map((step, move) => {
                const desc = move ?
                    'Go to move #' + move :
                    'Go to game start';
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)}>{desc}</button>
                    </li>
                )
            });

            let status;
            if(winner){
                status = 'Winner: ' + winner;
            }else{
                status = 'New player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i)=> this.handleSquareClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

//helper function to determine if board is in a win state
function calculateWinner(squares){
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];
    for(let i = 0; i < lines.length; i++){
        const [a,b,c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
