import json
import re

# Read current crypto assets
with open('/src/data/assets/cryptoAssets.ts', 'r', encoding='utf-8') as f:
    crypto_content = f.read()

# Read current stock assets
with open('/src/data/assets/stockAssets.ts', 'r', encoding='utf-8') as f:
    stock_content = f.read()

print("Files read successfully")
