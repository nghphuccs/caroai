import math

SIZE = 15

def is_win(board, player):
    def check_direction(x, y, dx, dy):
        for i in range(5):
            nx, ny = x + dx * i, y + dy * i
            if not (0 <= nx < SIZE and 0 <= ny < SIZE and board[ny][nx] == player):
                return False
        return True

    for y in range(SIZE):
        for x in range(SIZE):
            if check_direction(x, y, 1, 0) or check_direction(x, y, 0, 1) or \
               check_direction(x, y, 1, 1) or check_direction(x, y, 1, -1):
                return True
    return False

def evaluate_pattern(count, open_ends):
    if count >= 5:
        return 300000
    if count == 4:
        return 50000 if open_ends == 2 else 1112
    if count == 3:
        return 1000 if open_ends == 2 else 100
    if count == 2:
        return 100 if open_ends == 2 else 10
    return 0

def count_sequence(line, player):
    score, i, length = 0, 0, len(line)
    while i < length:
        if line[i] == player:
            count, left_open, right_open = 1, 0, 0
            if i-1 >= 0 and line[i-1] == 0: left_open = 1
            j = i+1
            while j < length and line[j] == player:
                count += 1
                j += 1
            if j < length and line[j] == 0: right_open = 1
            score += evaluate_pattern(count, left_open + right_open)
            i = j
        else:
            i += 1
    return score

def evaluate(board):
    total = 0
    for y in range(SIZE):
        row = board[y]
        total += count_sequence(row, -1)
        total -= count_sequence(row, 1)
    for x in range(SIZE):
        col = [board[y][x] for y in range(SIZE)]
        total += count_sequence(col, -1)
        total -= count_sequence(col, 1)
    for d in range(-SIZE+1, SIZE):
        diag1 = [board[y][y-d] for y in range(SIZE) if 0 <= y-d < SIZE]
        diag2 = [board[y][SIZE-1-y+d] for y in range(SIZE) if 0 <= SIZE-1-y+d < SIZE]
        total += count_sequence(diag1, -1) - count_sequence(diag1, 1)
        total += count_sequence(diag2, -1) - count_sequence(diag2, 1)
    return total

def get_candidate_moves(board, radius=1):
    candidates = set()
    for y in range(SIZE):
        for x in range(SIZE):
            if board[y][x] != 0:
                for dy in range(-radius, radius+1):
                    for dx in range(-radius, radius+1):
                        ny, nx = y+dy, x+dx
                        if 0 <= ny < SIZE and 0 <= nx < SIZE and board[ny][nx] == 0:
                            candidates.add((nx, ny))
    return list(candidates) if candidates else [(SIZE//2, SIZE//2)]

def minimax(board, depth, is_max, alpha, beta):
    if is_win(board, -1): return 1e7
    if is_win(board, 1): return -1e7
    if depth == 0: return evaluate(board)

    if is_max:
        max_eval = -math.inf
        for x, y in get_candidate_moves(board):
            board[y][x] = -1
            eval = minimax(board, depth-1, False, alpha, beta)
            board[y][x] = 0
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha: break
        return max_eval
    else:
        min_eval = math.inf
        for x, y in get_candidate_moves(board):
            board[y][x] = 1
            eval = minimax(board, depth-1, True, alpha, beta)
            board[y][x] = 0
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha: break
        return min_eval

def find_best_move(board):
    best_val, best_move = -math.inf, None
    for x, y in get_candidate_moves(board):
        board[y][x] = -1
        move_val = minimax(board, 1, False, -math.inf, math.inf)
        board[y][x] = 0
        if move_val > best_val:
            best_val, best_move = move_val, (x, y)
    return best_move
