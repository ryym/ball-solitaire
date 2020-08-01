import React, { useState, useEffect } from 'react';
import { css } from 'emotion';
import { createBoard, getMovableAddresses, getPossibleMoves, moveBall } from '../game';
import type { Address, Board as BoardType, Move, Direction } from '../game';
import { Board } from './Board';
import { DirectionSelect } from './DirectionSelect';

export function Game() {
  const { currentBoard, ...boardHistory } = useBoardHistory();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const movableAddresses = new Set(getMovableAddresses(currentBoard));
  const possibleDirs = new Set(getPossibleMoveDirs(currentBoard, selectedAddress));
  const ballCounts = countBalls(currentBoard);

  const moveSelectedBall = (dir: Direction) => {
    if (selectedAddress == null) {
      throw new Error('invalid state: selectedAddress is null when ball moving');
    }
    const nextBoard = moveBall(currentBoard, selectedAddress, dir);
    boardHistory.push(nextBoard);
    setSelectedAddress(null);
  };

  const toggleBallSelection = (addr: Address) => {
    setSelectedAddress(selectedAddress === addr ? null : addr);
  };

  const undoBoard = () => {
    boardHistory.undo();
    setSelectedAddress(null);
  };

  const redoBoard = () => {
    boardHistory.redo();
    setSelectedAddress(null);
  };

  const resetBoard = () => {
    boardHistory.reset();
    setSelectedAddress(null);
  };

  return (
    <div>
      {movableAddresses.size === 0 &&
        (ballCounts.remaining === 1 ? (
          <div className={styles.msgSuccess}>CLEAR! Conguratulations!</div>
        ) : (
          <div className={styles.msgFailure}>
            GAME OVER... But you captured {ballCounts.total - ballCounts.remaining} balls!
          </div>
        ))}
      <div className={styles.ballCount}>Remaining balls: {ballCounts.remaining}</div>
      <div className={styles.game}>
        <Board
          board={currentBoard}
          selectedAddress={selectedAddress}
          movableAddresses={movableAddresses}
          onSelectBall={toggleBallSelection}
        />
        <DirectionSelect possibleDirs={possibleDirs} onSelect={moveSelectedBall} />
      </div>
      <div className={styles.actions}>
        <button onClick={resetBoard}>Reset</button>
        <button onClick={undoBoard} disabled={!boardHistory.canUndo}>
          Undo
        </button>
        <button onClick={redoBoard} disabled={!boardHistory.canRedo}>
          Redo
        </button>
      </div>
    </div>
  );
}

interface BoardHistoryState {
  currentBoard: BoardType;
  canUndo: boolean;
  canRedo: boolean;
  push: (b: BoardType) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

const BOARD_SIDE_SIZE = 4;

const INITIAL_BOARD = createBoard(BOARD_SIDE_SIZE, BOARD_SIDE_SIZE / 2);

const useBoardHistory = (): BoardHistoryState => {
  const [cursor, setCursor] = useState(0);
  const [history, setHistory] = useState([INITIAL_BOARD]);

  const pushBoard = (board: BoardType) => {
    setHistory([...history.slice(0, cursor + 1), board]);
    setCursor(cursor + 1);
  };

  const undoBoardChange = () => {
    if (cursor >= 1) {
      setCursor(cursor - 1);
    }
  };

  const redoBoardChange = () => {
    if (cursor < history.length - 1) {
      setCursor(cursor + 1);
    }
  };

  const resetHistory = () => {
    setHistory([INITIAL_BOARD]);
    setCursor(0);
  };

  return {
    currentBoard: history[cursor],
    canUndo: cursor > 0,
    canRedo: cursor < history.length - 1,
    push: pushBoard,
    undo: undoBoardChange,
    redo: redoBoardChange,
    reset: resetHistory,
  };
};

interface BallCounts {
  readonly total: number;
  readonly remaining: number;
}

const countBalls = (b: BoardType): BallCounts => {
  const total = b.sideSize * b.sideSize - 1;
  const remaining = b.cells.filter((c) => c === 'Ball').length;
  return { total, remaining };
};

const getPossibleMoveDirs = (b: BoardType, from: Address | null): Direction[] => {
  const possibleMoves: Move[] = from == null ? [] : getPossibleMoves(b, from);
  return possibleMoves.map((m) => m.dir);
};

const styles = {
  msgSuccess: css({
    color: '#3d993d;',
    fontSize: '1.2em',
  }),

  msgFailure: css({
    color: '#f00',
  }),

  ballCount: css({
    margin: '8px 0',
  }),

  game: css({
    display: 'flex',
    marginBottom: '12px',
  }),

  actions: css({
    display: 'flex',
    alignItems: 'center',

    '> button': {
      padding: '4px',
      textTransform: 'uppercase',

      ':not(last-of-type)': {
        marginRight: '8px',
      },
    },
  }),
};
