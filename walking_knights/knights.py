from time import time
from queue import SimpleQueue


def to_str(num: int):
    assert num >= 0
    return str(num) if num > 9 else "0" + str(num)


def sq120to64(sq):
    rank = (sq // 12) - 2
    file = (sq % 12) - 2

    return rank * 8 + file + 1


def sq64to120(sq):
    rank = (sq - 1) // 8
    file = (sq - 1) % 8

    return 24 + 2 + (12 * rank) + file


moves = [
    -24 - 1,
    -24 + 1,
    -12 - 2,
    -12 + 2,
    12 + 2,
    12 - 2,
    24 + 1,
    24 - 1,
]


class Move:
    def __init__(self, square) -> None:
        self.square = square
        self.parent = None


class Pair:
    def __init__(self, start: int, end: int):
        assert type(start) == int and type(end) == int
        self.start = start
        self.end = end

    def __eq__(self, other):
        return isinstance(other, Pair) and hash(self) == hash(other)

    def __hash__(self):
        return hash(to_str(self.start) + to_str(self.end))


class Board:
    def __init__(self) -> None:
        self.board = [0 for _ in range(144)]
        for i in range(1, 65):
            sq = sq64to120(i)
            self.board[sq] = i

    def print(self):
        for i, x in enumerate(self.board):
            if i % 12 == 0:
                print()
            print(x, end="\t")
        print("\n\n")

    def moves(self, from_sq: Move):
        pseudo_legal = [from_sq.square + mv for mv in moves]
        legal = [sq for sq in pseudo_legal if self.board[sq] != 0]
        return [Move(sq) for sq in legal]


def bfs(board: Board, from_sq: Move, to_sq: Move, cache: dict = None) -> Move:
    q = SimpleQueue()
    q.put(from_sq)
    while not q.empty():
        v = q.get()

        # Check if this is our goal.
        if v.square == to_sq.square:
            if cache is not None:
                cache[Pair(from_sq.square, to_sq.square)] = v
            return v

        # Check whether we have already computed from here.
        if cache is not None and (pair := Pair(v.square, to_sq.square)) in cache:
            return cache[pair]

        # Expand current node.
        moves = board.moves(v)
        for mv in moves:
            mv.parent = v
            q.put(mv)

    return None


def knight_walk(start: str, end: str, cache: dict = None):
    board = Board()

    f = Move(sq64to120(start))
    t = Move(sq64to120(end))
    res = bfs(board, f, t, cache)

    if res:
        moves = list()
        while res.parent:
            moves.append(res)
            res = res.parent
        moves.append(res)
        moves.reverse()

        return [sq120to64(mv.square) for mv in moves]
    else:
        return None


def longest_walk(use_cache=False):
    cache = {} if use_cache else None
    longest = list()
    for from_sq in range(1, 65):
        for to_sq in range(1, 65):
            moves = knight_walk(from_sq, to_sq, cache=cache)
            if len(moves) > len(longest):
                longest = moves

    return longest


if __name__ == "__main__":
    start = time()
    longest = longest_walk(use_cache=False)
    end = time()

    print("Longest walk is ", longest)
    print(f"Computed in {end-start} seconds")
