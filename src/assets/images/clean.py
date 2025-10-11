from pathlib import Path

dir_path = Path('skill')

for path in dir_path.iterdir():
    if path.is_file():  # 确保是文件而不是目录
        # 创建新的文件名（保持原文件名，只修改后缀）
        new_path = path.with_suffix('.png')
        
        # 重命名文件
        path.rename(new_path)
        print(f"已重命名: {path.name} -> {new_path.name}")

print("批量重命名完成！")