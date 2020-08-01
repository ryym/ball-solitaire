import React from 'react';
import { css } from 'emotion';
import classnames from 'classnames';

export interface Props {
  readonly movable?: boolean;
  readonly willBreak?: boolean;
  readonly willPut?: boolean;
}

export function Ball({ movable, willBreak, willPut }: Props) {
  return (
    <div
      className={classnames({
        [styles.ball]: true,
        [styles.ballMovable]: movable,
        [styles.ballWillBreak]: willBreak,
        [styles.ballWillPut]: willPut,
      })}
    >
      {willBreak && <span className={styles.willBreakMark}>✓</span>}
    </div>
  );
}

const styles = {
  ball: css({
    height: '40px',
    width: '40px',
    borderRadius: '20px',
    backgroundColor: '#444',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  ballMovable: css({
    backgroundColor: '#ea6a2c',
  }),

  ballWillBreak: css({
    opacity: 0.8,
    // XXX: '&::after' does not work :(
  }),

  ballWillPut: css({
    backgroundColor: '#ea6a2c',
    opacity: 0.4,
  }),

  willBreakMark: css({
    color: '#35ea15',
    fontSize: '20px',
    fontWeight: 'bold',
  }),
};
