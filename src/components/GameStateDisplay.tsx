import React from 'react';
import { css } from 'emotion';
import type { Board } from '../game';

export interface Props {
  readonly board: Board;
  readonly isFinished: boolean;
}

export function GameStateDisplay({ board, isFinished }: Props) {
  const ballCounts = countBalls(board);
  return (
    <div>
      {isFinished && <FinishMessage {...ballCounts} />}
      <div className={styles.ballCount}>Remaining balls: {ballCounts.remaining}</div>
    </div>
  );
}

const FinishMessage = (ballCounts: BallCounts) => {
  return (
    <>
      {ballCounts.remaining === 1 ? (
        <div className={styles.msgSuccess}>CLEAR! Conguratulations!</div>
      ) : (
        <div className={styles.msgFailure}>
          GAME OVER... But you captured {ballCounts.total - ballCounts.remaining} balls!
        </div>
      )}
    </>
  );
};

interface BallCounts {
  readonly total: number;
  readonly remaining: number;
}

const countBalls = (b: Board): BallCounts => {
  const total = b.sideSize * b.sideSize - 1;
  const remaining = b.cells.filter((c) => c === 'Ball').length;
  return { total, remaining };
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
};
