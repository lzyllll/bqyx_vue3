from pathlib import Path

dir = Path('normalChip')

for path in dir.iterdir():
    if path.is_file() and path.stem.endswith('Chip'):
        # 构造新路径
        new_path = path.with_name(path.stem[:-4] + path.suffix)
        
        # 如果目标文件已存在，先删除它
        new_path.unlink(missing_ok=True)
        
        # 执行重命名
        path.rename(new_path)
        print(f"重命名: {path.name} → {new_path.name}")