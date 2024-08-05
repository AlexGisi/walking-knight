from queue import SimpleQueue

def sq120to64(sq):
    rank = (sq // 12) - 2
    file = (sq % 12) - 2
    
    return rank*8 + file + 1

def sq64to120(sq):
    rank = (sq-1) // 8
    file = (sq-1) % 8
    
    return 24 + 2 + (12 * rank) + file

moves = [-24-1,
         -24+1,
         -12-2,
         -12+2,
         12+2,
         12-2,
         24+1,
         24-1,
]

class Move:
    def __init__(self, square) -> None:
        self.square = square
        self.parent = None


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
            print(x, end='\t')
        print('\n\n')
            
    def moves(self, from_sq: Move):
        pseudo = [from_sq.square + mv for mv in moves]
        legal = [sq for sq in pseudo if self.board[sq] != 0]
        return [Move(sq) for sq in legal]
    
def bfs(from_sq: Move, to_sq: Move) -> Move:
    q = SimpleQueue()
    q.put(from_sq)
    while not q.empty():
        v = q.get()
        if v.square == to_sq.square:
            return v
        moves = board.moves(v)
        for mv in moves:
            mv.parent = v
            q.put(mv)
            
    return None
                
                
if __name__ == '__main__':
    board = Board()
    board.print()
    
    F = 44
    T = 14
    
    f = Move(sq64to120(F))
    t = Move(sq64to120(T))
    res = bfs(f, t)
    
    if res:
        moves = list()
        while res.parent:
            moves.append(res)
            res = res.parent
        moves.append(res)
        moves.reverse()
        
        for mv in moves:
            print(sq120to64(mv.square))
    else:
        print("Not possible")
    