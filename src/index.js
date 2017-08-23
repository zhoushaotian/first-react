import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

class Square extends React.Component {
    constructor() {
        super();
        this.state = {
            value: null
        }
    }
    render() {
        return (
            <button className="square" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }
}

class Board extends React.Component {
    render() {
        const {onClick} = this.props;
        return (
            <div className="game-item">
                {[0,1,2,3,4,5,6,7,8].map((value) => {
                    return (
                        <Square
                            value={this.props.squares[value]}
                            onClick={() => onClick(value)}
                            key={value}
                        />
                    )
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(current.squares) || squares[i]) {
            return;
        }
        this.state.xIsNext ? squares[i] = 'X' : squares[i] = 'O';
        this.setState({
            history: history.concat([{
                squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }
    constructor() {
        super();
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        };
    }
    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? 'Move #' + move : '来吃狗';
            return (
                <li key={move}>
                    <a href="#" onClick={() => this.jumpTo(move)}> { desc }</a>
                </li>
            )
        });
        let status;
        if (winner) {
            status = 'winner:' + winner;
        } else {
            status = 'The next player is: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
