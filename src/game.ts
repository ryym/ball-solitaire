// Ball Solitaire game from Super Mario RPG

export const Directions = ['Up', 'Down', 'Left', 'Right'] as const;

export type Direction = typeof Directions[number];

export type Cell = 'Ball' | 'Empty';

export type Address = number;

export interface Board {
  readonly sideSize: number;
  readonly cells: readonly Cell[];
}

export interface Move {
  readonly dir: Direction;
  readonly dest: Address;
  readonly broken: Address;
}

export const createBoard = (sideSize: number, emptyAddress: Address): Board => {
  if (!(2 < sideSize && sideSize < 100)) {
    throw new Error(`invalid side size: ${sideSize}`);
  }

  const maxAddress = sideSize * sideSize - 1;
  if (!(0 <= emptyAddress && emptyAddress <= maxAddress)) {
    throw new Error(`Invalid emptyAddress: ${emptyAddress}`);
  }

  const cells: Cell[] = [];
  for (let addr = 0; addr <= maxAddress; addr++) {
    cells[addr] = addr === emptyAddress ? 'Empty' : 'Ball';
  }

  return { sideSize, cells };
};

export const isValidAddress = (b: Board, addr: Address): boolean => {
  return 0 <= addr && addr < b.cells.length;
};

export const isInSameLine = (b: Board, addr1: Address, addr2: Address): boolean => {
  if (!isValidAddress(b, addr1) || !isValidAddress(b, addr2)) {
    return false;
  }
  const leftmost = addr1 - (addr1 % b.sideSize);
  const rightmost = leftmost + b.sideSize - 1;
  return leftmost <= addr2 && addr2 <= rightmost;
};

export const getMove = (b: Board, from: Address, dir: Direction): Move | null => {
  const pn = dir === 'Up' || dir === 'Left' ? -1 : 1;

  switch (dir) {
    case 'Up':
    case 'Down': {
      const dest = from + b.sideSize * 2 * pn;
      if (!isValidAddress(b, dest)) {
        return null;
      }
      return { dir, dest, broken: from + b.sideSize * pn };
    }

    case 'Left':
    case 'Right': {
      const dest = from + 2 * pn;
      if (!isInSameLine(b, from, dest)) {
        return null;
      }
      return { dir, dest, broken: from + pn };
    }
  }
};

export const isValidMove = (b: Board, move: Move): boolean => {
  return b.cells[move.broken] === 'Ball' && b.cells[move.dest] === 'Empty';
};

export const getMoveIfValid = (b: Board, from: Address, dir: Direction): Move | null => {
  const move = getMove(b, from, dir);
  return move && isValidMove(b, move) ? move : null;
};

export const getPossibleMoves = (b: Board, from: Address): Move[] => {
  const moves: Move[] = [];
  for (const dir of Directions) {
    const move = getMoveIfValid(b, from, dir);
    if (move != null) {
      moves.push(move);
    }
  }
  return moves;
};

export const getMovableAddresses = (b: Board): Address[] => {
  const addresses: Address[] = [];
  for (let addr = 0; addr < b.cells.length; addr++) {
    if (b.cells[addr] === 'Empty') {
      continue;
    }
    if (getPossibleMoves(b, addr).length > 0) {
      addresses.push(addr);
    }
  }
  return addresses;
};

export const moveBall = (b: Board, from: Address, dir: Direction): Board => {
  const move = getMoveIfValid(b, from, dir);
  if (move == null) {
    return b;
  }
  const cells = [...b.cells];
  cells[from] = 'Empty';
  cells[move.broken] = 'Empty';
  cells[move.dest] = 'Ball';
  return { ...b, cells };
};
