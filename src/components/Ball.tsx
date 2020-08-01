import React from 'react';
import { css } from 'emotion';
import classnames from 'classnames';

export interface Props {
  readonly movable: boolean;
}

export function Ball({ movable }: Props) {
  return (
    <div
      className={classnames({
        [styles.ball]: true,
        [styles.ballMovable]: movable,
      })}
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
    backgroundColor: '#ea6a2c',
  }),
};
