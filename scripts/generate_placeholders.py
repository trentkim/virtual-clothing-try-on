import os
from PIL import Image, ImageDraw

def create_placeholder(path, text, color):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img = Image.new('RGB', (512, 512), color=color)
    d = ImageDraw.Draw(img)
    d.text((200, 250), text, fill=(255, 255, 255))
    img.save(path)
    print(f"Created {path}")

clothing_items = [
    ("top-001", "White T-Shirt", (200, 200, 200)),
    ("top-002", "Navy Polo", (0, 0, 128)),
    ("top-003", "Striped Shirt", (100, 100, 255)),
    ("bottom-001", "Blue Jeans", (0, 0, 255)),
    ("bottom-002", "Black Chinos", (0, 0, 0)),
    ("dress-001", "Floral Dress", (255, 100, 100)),
    ("dress-002", "Black Dress", (20, 20, 20)),
    ("outerwear-001", "Denim Jacket", (70, 130, 180)),
    ("outerwear-002", "Trench Coat", (245, 245, 220)),
    ("top-004", "Black Tank", (30, 30, 30)),
]

base_path = "/Users/trentkim/Documents/virtual-clothing-try-on/sample-data"

for item_id, name, color in clothing_items:
    # Main image
    create_placeholder(f"{base_path}/clothing/{item_id}.png", name, color)
    # Thumbnail
    create_placeholder(f"{base_path}/thumbnails/{item_id}.png", name, color)

print("All placeholders created.")
