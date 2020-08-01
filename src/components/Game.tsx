import React, { useState } from 'react';
import { css } from 'emotion';
import { createBoard, getMovableAddresses, getPossibleMoves, moveBall } from '../game';
import type { Address, Board as BoardType, Move, Direction } from '../game';
import { Board } from './Board';
import { DirectionSelect } from './DirectionSelect';

interface GameState {
  readonly board: BoardType;

  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly undoBoardChange: () => void;
  readonly redoBoardChange: () => void;

  readonly selectedAddress: Address | null;
  readonly totalBallCount: number;
  readonly remainingBallCount: number;
  readonly movableAddresses: Set<Address>;
  readonly possibleDirs: Set<Direction>;

  readonly moveSelectedBall: (dir: Direction) => void;
  readonly toggleBallSelection: (addr: Address) => void;
  readonly resetBoard: () => void;
}

export function Game() {
  const state = useGameState();
  return (
    <div>
      {state.movableAddresses.size === 0 &&
        (state.remainingBallCount === 1 ? (
          <div className={styles.msgSuccess}>CLEAR! Conguratulations!</div>
        ) : (
          <div className={styles.msgFailure}>
            GAME OVER... But you captured {state.totalBallCount - state.remainingBallCount} balls!
          </div>
        ))}
      <div className={styles.ballCount}>Remaining balls: {state.remainingBallCount}</div>
      <div className={styles.game}>
        <Board
          board={state.board}
          selectedAddress={state.selectedAddress}
          movableAddresses={state.movableAddresses}
          onSelectBall={state.toggleBallSelection}
        />
        <DirectionSelect possibleDirs={state.possibleDirs} onSelect={state.moveSelectedBall} />
      </div>
      <div className={styles.actions}>
        <button onClick={state.resetBoard}>Reset</button>
        <button onClick={state.undoBoardChange} disabled={!state.canUndo}>
          Undo
        </button>
        <button onClick={state.redoBoardChange} disabled={!state.canRedo}>
          Redo
        </button>
      </div>
    </div>
  );
}

const BOARD_SIDE_SIZE = 4;

const useGameState = (): GameState => {
  const [board, setBoard] = useState(() => createBoard(BOARD_SIDE_SIZE, BOARD_SIDE_SIZE / 2));

  const [boardHistoryCursor, setBoardHistoryCursor] = useState(0);
  const [boardHistories, setBoardHistories] = useState([board]);

  const pushBordHistory = (board: BoardType) => {
    setBoard(board);
    setBoardHistories([...boardHistories.slice(0, boardHistoryCursor + 1), board]);
    setBoardHistoryCursor(boardHistoryCursor + 1);
  };

  const undoBoardChange = () => {
    if (boardHistoryCursor >= 1) {
      const prevBoard = boardHistories[boardHistoryCursor - 1];
      setBoard(prevBoard);
      setBoardHistoryCursor(boardHistoryCursor - 1);
    }
  };

  const redoBoardChange = () => {
    if (boardHistoryCursor < boardHistories.length - 1) {
      const nextBoard = boardHistories[boardHistoryCursor + 1];
      setBoard(nextBoard);
      setBoardHistoryCursor(boardHistoryCursor + 1);
    }
  };

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const remainingBallCount = board.cells.filter((c) => c === 'Ball').length;

  const movableAddresses = new Set(getMovableAddresses(board));

  const possibleMoves: Move[] =
    selectedAddress == null ? [] : getPossibleMoves(board, selectedAddress);
  const possibleDirs = new Set(possibleMoves.map((m) => m.dir));

  const moveSelectedBall = (dir: Direction) => {
    if (selectedAddress == null) {
      throw new Error('invalid state: selectedAddress is null when ball moving');
    }
    const nextBoard = moveBall(board, selectedAddress, dir);
    pushBordHistory(nextBoard);
    setSelectedAddress(null);
  };

  const toggleBallSelection = (addr: Address) => {
    setSelectedAddress(selectedAddress === addr ? null : addr);
  };

  const resetBoard = () => {
    const initialBoard = createBoard(BOARD_SIDE_SIZE, BOARD_SIDE_SIZE / 2);
    setBoard(initialBoard);
    setBoardHistories([initialBoard]);
    setBoardHistoryCursor(0);
    setSelectedAddress(null);
  };

  return {
    board,
    canUndo: boardHistoryCursor > 0,
    canRedo: boardHistoryCursor < boardHistories.length - 1,
    undoBoardChange,
    redoBoardChange,

    totalBallCount: BOARD_SIDE_SIZE * BOARD_SIDE_SIZE - 1,
    remainingBallCount,
    selectedAddress,
    movableAddresses,
    possibleDirs,
    moveSelectedBall,
    toggleBallSelection,
    resetBoard,
  };
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
