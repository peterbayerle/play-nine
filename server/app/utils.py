import random

def random_string(n):
    return ''.join(
        random.choice([chr(i) for i in range(ord('a'),ord('z'))]) for _ in range(n)
    )

def generate_code(excluding=[], code_len=4):
    if len(excluding) == 26**code_len: return None

    while (s := random_string(code_len)) in excluding: ...
    return s

def log(message):
    red = "\033[0;31m"
    white = "\033[0;97m"

    print(red, message, white, sep='')
