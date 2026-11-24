import time

c = {
    "reset": "\x1b[0m",
    "bold": "\x1b[1m",
    "dim": "\x1b[2m",
    "red": "\x1b[31m",
    "green": "\x1b[32m",
    "yellow": "\x1b[33m",
    "blue": "\x1b[34m",
    "magenta": "\x1b[35m",
    "cyan": "\x1b[36m",
    "gray": "\x1b[90m",
}


def getDateString(fmt: str = "%Y-%m-%d") -> str:
    return time.strftime(fmt, time.localtime())


def getTimeString(fmt: str = "%H:%M:%S") -> str:
    return time.strftime(fmt, time.localtime())


def joinList(arr: list, intertupt: str = "") -> str:
    try:
        s = ""
        for i in range(len(arr)):
            s += str(arr[i]) + (intertupt if i != len(arr) - 1 else "")
        return s
    except Exception as e:
        TerminalLog.error(f"joinList failed: {e}")
        return ""


def belongTwo(a1, a2) -> list:
    return [e for e in a1 if e in a2]


def getByKeys(dictionary: dict, keys) -> list:
    return [dictionary[k] for k in keys if k in dictionary.keys()]


class TerminalLog:
    def __init__(self):
        pass

    @staticmethod
    def style(content, style=""):
        reset = c["reset"]
        green = c["green"]
        red = c["red"]
        yellow = c["yellow"]

        if isinstance(style, list):
            codes = joinList(getByKeys(c, belongTwo(style, c.keys())))
            return f"{codes}{content}{reset}"

        if isinstance(style, str):
            match style.lower():
                case "importance":
                    return f"{green}{content}{reset}"
                case "error":
                    return f"{red}{content}{reset}"
                case "warning":
                    return f"{yellow}{content}{reset}"
                case _:
                    return f"{reset}{content}"

        return content

    @staticmethod
    def write(content, style="note", showDate: bool = False, showTime: bool = True):
        date_str = getDateString() if showDate else ""
        sep = " | " if (showDate and showTime) else ""
        time_str = getTimeString() if showTime else ""
        prefix = f"{date_str}{sep}{time_str}"
        styled = TerminalLog.style(content, style)

        if prefix:
            print(f"[{prefix}] {styled}", flush=True)
        else:
            print(styled, flush=True)

    @staticmethod
    def error(content):
        TerminalLog.write(content, style="error")


# from functools import wraps
# from flask import request       
# def log_api(func):
#     @wraps(func)
#     def wrapper(*args, **kwargs):
#         response = func(*args, **kwargs)
#         # Xử lý cả trường hợp route trả về tuple (jsonify(...), 201) hoặc Response
#         if isinstance(response, tuple):
#             resp_obj, status_code = response[0], response[1]
#         else:
#             resp_obj, status_code = response, getattr(response, "status_code", 200)

#         style = "error" if status_code >= 500 else ("importance" if status_code < 400 else ["bold", "yellow"])
#         msg = f"['{request.method}' {request.path} - status:{status_code}"
#         TerminalLog.write(msg, style=style)
#         return response
#     return wrapper