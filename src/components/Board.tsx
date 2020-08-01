import React from 'react';
import { css } from 'emotion';
import classnames from 'classnames';
import type { Board as BoardType, Address } from '../game';
import { Ball } from './Ball';

export interface Props {
  readonly board: BoardType;
  readonly selectedAddress: Address | null;
  readonly movableAddresses: Set<Address>;
  readonly onSelectBall: (address: Address) => void;
}

export function Board({ board, selectedAddress, movableAddresses, onSelectBall }: Props) {
  return (
    <div className={styles.board}>
      {board.cells.map((cell, addr) => (
        <div
          key={addr}
          className={classnames({
            [styles.cell]: true,
            [styles.cellSelected]: selectedAddress === addr,
          })}
        >
          {cell === 'Ball' && (
            <Ball address={addr} movable={movableAddresses.has(addr)} onSelect={onSelectBall} />
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  board: css({
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '260px',
    border: '1px solid #ddd',
    padding: '4px',
  }),

  cell: css({
    height: '60px',
    width: '60px',
    border: '1px solid #ddd',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  cellSelected: css({
    backgroundColor: '#fffc3185',
  }),
};
