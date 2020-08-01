import React, { useState } from 'react';
import { css } from 'emotion';
import { createBoard, getMovableAddresses, getPossibleMoves, moveBall } from '../game';
import type { Address, Board as BoardType, Move, Direction } from '../game';
import { Board } from './Board';
import { DirectionSelect } from './DirectionSelect';

interface GameState {
  readonly board: BoardType;
  readonly selectedAddress: Address | null;
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
      <div>
        <button onClick={state.resetBoard}>Reset</button>
      </div>
    </div>
  );
}

const useGameState = (): GameState => {
  const [board, setBoard] = useState(() => createBoard(4, 2));
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
    setBoard(nextBoard);
    setSelectedAddress(null);
  };

  const toggleBallSelection = (addr: Address) => {
    setSelectedAddress(selectedAddress === addr ? null : addr);
  };

  const resetBoard = () => {
    setBoard(createBoard(4, 2));
    setSelectedAddress(null);
  };

  return {
    board,
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
  ballCount: css({
    marginBottom: '8px',
  }),

  game: css({
    display: 'flex',
    marginBottom: '12px',
  }),
};
