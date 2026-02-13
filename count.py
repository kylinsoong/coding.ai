import os

# File extensions to include
EXTENSIONS = {
    ".py", ".java", ".js", ".jsx", ".ts",
    ".go", ".cpp", ".c", ".html", ".css"
}


def is_single_line_comment(line, ext):
    stripped = line.strip()

    if not stripped:
        return False

    # Python / Shell
    if ext in {".py", ".sh"}:
        return stripped.startswith("#")

    # JS / JSX / TS / Java / Go / C / C++
    if ext in {".js", ".jsx", ".ts", ".java", ".go", ".cpp", ".c"}:
        return stripped.startswith("//")

    # HTML
    if ext == ".html":
        return stripped.startswith("<!--")

    return False


def count_lines(root_dir):
    total_lines = 0
    code_lines = 0
    comment_lines = 0
    blank_lines = 0

    for root, _, files in os.walk(root_dir):
        # ignore common large folders
        if any(skip in root for skip in ["node_modules", "venv", ".git", "dist", "build"]):
            continue

        for file in files:
            ext = os.path.splitext(file)[1]

            if ext not in EXTENSIONS:
                continue

            file_path = os.path.join(root, file)

            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    in_block_comment = False

                    for line in f:
                        total_lines += 1
                        stripped = line.strip()

                        if not stripped:
                            blank_lines += 1
                            continue

                        # Handle block comments
                        if ext in {".js", ".jsx", ".ts", ".java", ".go", ".cpp", ".c"}:
                            if "/*" in stripped:
                                in_block_comment = True
                                comment_lines += 1
                                continue

                            if "*/" in stripped:
                                in_block_comment = False
                                comment_lines += 1
                                continue

                            if in_block_comment:
                                comment_lines += 1
                                continue

                            # JSX style comment: {/* comment */}
                            if stripped.startswith("{/*"):
                                comment_lines += 1
                                continue

                        # Single-line comment
                        if is_single_line_comment(line, ext):
                            comment_lines += 1
                        else:
                            code_lines += 1

            except Exception as e:
                print(f"Error reading {file_path}: {e}")

    return total_lines, code_lines, comment_lines, blank_lines


if __name__ == "__main__":
    directory = input("Enter directory path: ").strip()
    total, code, comments, blank = count_lines(directory)

    print("\n===== Code Statistics =====")
    print(f"Total lines   : {total}")
    print(f"Code lines    : {code}")
    print(f"Comment lines : {comments}")
    print(f"Blank lines   : {blank}")

