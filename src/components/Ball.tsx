import React from 'react';
import { css } from 'emotion';
import classnames from 'classnames';
import type { Address } from '../game';

export interface Props {
  readonly address: Address;
  readonly movable: boolean;
  readonly onSelect: (addr: Address) => void;
}

export function Ball({ address, movable, onSelect }: Props) {
  return (
    <div
      className={classnames({
        [styles.ball]: true,
        [styles.ballMovable]: movable,
      })}
      onClick={() => movable && onSelect(address)}
    />
  );
}

const styles = {
  ball: css({
    height: '40px',
    width: '40px',
    borderRadius: '20px',
    backgroundColor: '#444',
  }),

  ballMovable: css({
    cursor: 'pointer',
    backgroundColor: '#ea6a2c',
  }),
};
