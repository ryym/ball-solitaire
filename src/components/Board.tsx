import React, { useState } from 'react';
import { css } from 'emotion';
import classnames from 'classnames';
import { getPossibleMoves } from '../game';
import type { Board as BoardType, Address, Direction, Move } from '../game';
import { Ball } from './Ball';

export interface Props {
  readonly board: BoardType;
  readonly movableAddresses: Set<Address>;
  readonly onSelectMove: (from: Address, move: Move) => void;
}

export function Board({ board, movableAddresses, onSelectMove }: Props) {
  const [hoveredAddress, setHoveredAddress] = useState<Address | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Move[]>([]);

  const handleCellMouseEnter = (addr: Address) => {
    const moves = getPossibleMoves(board, addr);
    setHoveredAddress(addr);
    setPossibleMoves(moves);
  };
  const handleCellMouseLeave = (addr: Address) => {
    if (addr === hoveredAddress) {
      setHoveredAddress(null);
      setPossibleMoves([]);
    }
  };

  return (
    <div className={styles.board}>
      {board.cells.map((cell, addr) => (
        <div
          onMouseEnter={() => handleCellMouseEnter(addr)}
          onMouseLeave={() => handleCellMouseLeave(addr)}
          key={addr}
          className={styles.cell}
        >
          {cell === 'Ball' && (
            <>
              {addr === hoveredAddress && (
                <>
                  {possibleMoves.map((m) => (
                    <div
                      key={m.dir}
                      className={classnames(styles.dirSelect, getDirSelectClass(m.dir))}
                      onClick={() => onSelectMove(addr, m)}
                    />
                  ))}
                </>
              )}
              <Ball movable={movableAddresses.has(addr)} />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const getDirSelectClass = (dir: Direction): string => {
  switch (dir) {
    case 'Up':
      return styles.dirSelectUp;
    case 'Down':
      return styles.dirSelectDown;
    case 'Right':
      return styles.dirSelectRight;
    case 'Left':
      return styles.dirSelectLeft;
  }
};

const styles = {
  board: css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '264px',
    border: '1px solid #ddd',
    padding: '8px',
    paddingBottom: '6px',
  }),

  cell: css({
    position: 'relative',
    height: '60px',
    width: '60px',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2px',
  }),

  dirSelect: css({
    cursor: 'pointer',
    position: 'absolute',
    borderStyle: 'solid',
    borderColor: 'transparent',
    zIndex: 10,
  }),

  dirSelectUp: css({
    top: '-12px',
    borderWidth: '0 20px 16px 20px',
    borderBottomColor: '#1e80ff',
  }),

  dirSelectRight: css({
    right: '-12px',
    borderWidth: '20px 0 20px 16px',
    borderLeftColor: '#1e80ff',
  }),

  dirSelectDown: css({
    bottom: '-12px',
    borderWidth: '16px 20px 0 20px',
    borderTopColor: '#1e80ff',
  }),

  dirSelectLeft: css({
    left: '-12px',
    borderWidth: '20px 16px 20px 0',
    borderRightColor: '#1e80ff',
  }),
};
