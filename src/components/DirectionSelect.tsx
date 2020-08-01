import React from 'react';
import { css } from 'emotion';
import { Directions } from '../game';
import type { Direction } from '../game';

export interface Props {
  readonly possibleDirs: Set<Direction>;
  readonly onSelect: (dir: Direction) => void;
}

export function DirectionSelect({ possibleDirs, onSelect }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.list}>
        {Directions.map((dir) => (
          <button
            key={dir}
            className={styles.dir}
            disabled={!possibleDirs.has(dir)}
            onClick={() => onSelect(dir)}
          >
            {dir}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: css({
    marginLeft: '12px',
  }),

  list: css({
    display: 'flex',
    flexDirection: 'column',
  }),

  dir: css({
    cursor: 'pointer',
    width: '60px',
    padding: '8px',
    textAlign: 'center',
    boxShadow: '0',
    border: '1px solid #ddd',
    backgroundColor: 'transparent',

    '&:not(:last-of-type)': {
      marginBottom: '8px',
    },

    '&:disabled': {
      cursor: 'default',
      opacity: '0.8',
    },
  }),
};
