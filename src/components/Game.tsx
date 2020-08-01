import React, { useState } from 'react';
import { css } from 'emotion';
import { createBoard, getMovableAddresses, getPossibleMoves, moveBall } from '../game';
import type { Address, Board as BoardType, Move, Direction } from '../game';
import { GameStateDisplay } from './GameStateDisplay';
import { Board } from './Board';

export function Game() {
  const { currentBoard, ...boardHistory } = useBoardHistory();

  const movableAddresses = new Set(getMovableAddresses(currentBoard));

  const executeMove = (from: Address, move: Move) => {
    const nextBoard = moveBall(currentBoard, from, move.dir);
    boardHistory.push(nextBoard);
  };

  return (
    <div className={styles.container}>
      <main>
        <GameStateDisplay board={currentBoard} isFinished={movableAddresses.size === 0} />
        <div className={styles.game}>
          <Board
            board={currentBoard}
            movableAddresses={movableAddresses}
            onSelectMove={executeMove}
          />
        </div>
        <div className={styles.actions}>
          <button onClick={boardHistory.reset}>Reset</button>
          <button onClick={boardHistory.undo} disabled={!boardHistory.canUndo}>
            Undo
          </button>
          <button onClick={boardHistory.redo} disabled={!boardHistory.canRedo}>
            Redo
          </button>
        </div>
      </main>
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

const getPossibleMoveDirs = (b: BoardType, from: Address | null): Direction[] => {
  const possibleMoves: Move[] = from == null ? [] : getPossibleMoves(b, from);
  return possibleMoves.map((m) => m.dir);
};

const styles = {
  container: css({
    display: 'flex',
    justifyContent: 'center',
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
