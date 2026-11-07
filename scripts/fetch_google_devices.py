import csv
import json
import os
import urllib.request

CSV_URL = "http://storage.googleapis.com/play_public/supported_devices.csv"
OUTPUT_DIR = "data/raw"
os.makedirs(OUTPUT_DIR, exist_ok=True)

print("Downloading Google Certified Android Devices CSV...")
local_csv = os.path.join(OUTPUT_DIR, "supported_devices.csv")

# Google's CSV is UTF-16LE encoded
req = urllib.request.Request(CSV_URL, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as resp, open(local_csv, 'wb') as f:
    f.write(resp.read())

print("Parsing CSV data...")
devices = {}
with open(local_csv, mode='r', encoding='utf-16') as f:
    reader = csv.reader(f)
    header = next(reader) # Retail Branding, Marketing Name, Device, Model
    for row in reader:
        if len(row) < 4:
            continue
        brand, marketing_name, codename, model = row[0].strip(), row[1].strip(), row[2].strip(), row[3].strip()
        if not brand or not marketing_name:
            continue
            
        key = f"{brand}_{marketing_name}".lower().replace(" ", "_")
        if key not in devices:
            devices[key] = {
                "brand": brand,
                "name": marketing_name,
                "models": set(),
                "codenames": set()
            }
        devices[key]["models"].add(model)
        devices[key]["codenames"].add(codename)

# Export sample JSON
clean_devices = []
for k, v in devices.items():
    clean_devices.append({
        "brand": v["brand"],
        "name": v["name"],
        "models": sorted(list(v["models"])),
        "codenames": sorted(list(v["codenames"]))
    })

with open("data/raw/google_play_devices.json", "w", encoding="utf-8") as out:
    json.dump(clean_devices, out, indent=2)

print(f"Done! Parsed {len(clean_devices)} unique device families into data/raw/google_play_devices.json.")

