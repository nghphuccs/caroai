SIZE = 15

def check_direction(board, x, y, dx, dy, player):
    for i in range(5):
        nx = x + dx * i
        ny = y + dy * i
        if not (0 <= nx < SIZE and 0 <= ny < SIZE and board[ny][nx] == player):
            return False
    return True

def is_win(board, player):
    for y in range(SIZE):
        for x in range(SIZE):
            if check_direction(board, x, y, 1, 0, player): return True
            if check_direction(board, x, y, 0, 1, player): return True
            if check_direction(board, x, y, 1, 1, player): return True
            if check_direction(board, x, y, 1, -1, player): return True
    return False

# Copy các hàm evaluate_pattern, count_sequence, evaluate, get_candidate_moves, minimax y như bạn đang có.
# Sửa lại để tất cả đều truyền 'board' vào tham số!

def evaluate_pattern(count, open_ends):
    if count >= 5:
        return 300000
    if count == 4:
        if open_ends == 2:
            return 50000
        elif open_ends == 1:
            return 1112
    if count == 3:
        if open_ends == 2:
            return 1000
        elif open_ends == 1:
            return 100
    if count == 2:
        if open_ends == 2:
            return 100
        elif open_ends == 1:
            return 10
    return 0

def count_sequence(line, player):
    score = 0
    i = 0
    length = len(line)
    while i < length:
        if line[i] == player:
            count = 1
            left_open = 0
            right_open = 0

            if i - 1 >= 0 and line[i - 1] == 0:
                left_open = 1

            j = i + 1
            while j < length and line[j] == player:
                count += 1
                j += 1

            if j < length and line[j] == 0:
                right_open = 1

            open_ends = left_open + right_open
            score += evaluate_pattern(count, open_ends)
            i = j
        else:
            i += 1
    return score

def evaluate(board):
    total_score = 0
    for y in range(SIZE):
        row = board[y]
        total_score += count_sequence(row, -1)
        total_score -= count_sequence(row, 1)
    for x in range(SIZE):
        col = [board[y][x] for y in range(SIZE)]
        total_score += count_sequence(col, -1)
        total_score -= count_sequence(col, 1)
    for d in range(-SIZE + 1, SIZE):
        diag1 = [board[y][y - d] for y in range(SIZE) if 0 <= y - d < SIZE]
        diag2 = [board[y][SIZE - 1 - y + d] for y in range(SIZE) if 0 <= SIZE - 1 - y + d < SIZE]
        total_score += count_sequence(diag1, -1)
        total_score -= count_sequence(diag1, 1)
        total_score += count_sequence(diag2, -1)
        total_score -= count_sequence(diag2, 1)
    return total_score

def get_candidate_moves(board, radius=1):
    candidates = set()
    for y in range(SIZE):
        for x in range(SIZE):
            if board[y][x] != 0:
                for dy in range(-radius, radius + 1):
                    for dx in range(-radius, radius + 1):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < SIZE and 0 <= nx < SIZE:
                            if board[ny][nx] == 0:
                                candidates.add((nx, ny))
    if not candidates:
        return [(SIZE // 2, SIZE // 2)]
    return list(candidates)

def minimax(board, depth, is_maximizing, alpha, beta):
    if is_win(board, -1):
        return 10000000
    if is_win(board, 1):
        return -10000000
    if depth == 0:
        return evaluate(board)

    if is_maximizing:
        max_eval = float('-inf')
        for x, y in get_candidate_moves(board, radius=1):
            board[y][x] = -1
            eval = minimax(board, depth - 1, False, alpha, beta)
            board[y][x] = 0
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        return max_eval
    else:
        min_eval = float('inf')
        for x, y in get_candidate_moves(board, radius=1):
            board[y][x] = 1
            eval = minimax(board, depth - 1, True, alpha, beta)
            board[y][x] = 0
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break
        return min_eval

def find_best_move(board):
    best_val = float('-inf')
    best_move = None
    for x, y in get_candidate_moves(board, radius=1):
        board[y][x] = -1
        move_val = minimax(board, 1, False, float('-inf'), float('inf'))
        board[y][x] = 0
        if move_val > best_val:
            best_val = move_val
            best_move = (x, y)
    return best_move
