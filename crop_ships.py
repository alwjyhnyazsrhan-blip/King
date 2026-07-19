#!/usr/bin/env python3
import os
import sys
from PIL import Image

def crop_sheets():
    # Target directory
    output_dir = "./public/assets/ships"
    os.makedirs(output_dir, exist_ok=True)

    print("=== Ship Image Cropper Script ===")
    
    # Check for the sheets in common locations
    sheet1_paths = ["./public/assets/ships_1_17.png", "./assets/ships_1_17.png", "./ships_1_17.png"]
    sheet2_paths = ["./public/assets/ships_18_31.png", "./assets/ships_18_31.png", "./ships_18_31.png"]

    sheet1 = None
    sheet2 = None

    for p in sheet1_paths:
        if os.path.exists(p):
            sheet1 = p
            break

    for p in sheet2_paths:
        if os.path.exists(p):
            sheet2 = p
            break

    if not sheet1 or not sheet2:
        print("\n[!] Error: Please upload the two sheets to the project directory first.")
        print("Expected filenames in the root directory or inside './assets/':")
        print("  - 'ships_1_17.png' (or .jpg) for levels 1 to 17")
        print("  - 'ships_18_31.png' (or .jpg) for levels 18 to 31")
        print("\nOnce uploaded, run this script using the command: python crop_ships.py")
        sys.exit(1)

    print(f"Found Sheet 1 (1-17) at: {sheet1}")
    print(f"Found Sheet 2 (18-31) at: {sheet2}")

    # Process Sheet 1 (Levels 1 to 17)
    # This image has 3 rows:
    # Row 1: Levels 1, 2, 3, 4, 5, 6
    # Row 2: Levels 7, 8, 9, 10, 11, 12
    # Row 3: Levels 13, 14, 15, 16, 17
    print("\nProcessing Sheet 1...")
    img1 = Image.open(sheet1)
    w1, h1 = img1.size

    # Proportional grid coordinates for Sheet 1
    # Y-range for the main grid (excluding main header and footer)
    grid_y_start = int(h1 * 0.05)
    grid_y_end = int(h1 * 0.88)
    row_height = (grid_y_end - grid_y_start) / 3

    # Row 1 (Levels 1-6)
    for col in range(6):
        lvl = col + 1
        x_start = int(w1 * (col / 6.0))
        x_end = int(w1 * ((col + 1) / 6.0))
        y_start = int(grid_y_start)
        y_end = int(grid_y_start + row_height)
        
        # Crop the upper section of the card containing the ship illustration
        # Inner padding to get the actual ship frame inside the card
        pad_x = int((x_end - x_start) * 0.02)
        pad_y_top = int(row_height * 0.14)
        pad_y_bottom = int(row_height * 0.35)
        
        crop_box = (x_start + pad_x, y_start + pad_y_top, x_end - pad_x, y_end - pad_y_bottom)
        ship_crop = img1.crop(crop_box)
        ship_crop.save(f"{output_dir}/{lvl}.png", "PNG")
        print(f"  Saved Level {lvl}: {output_dir}/{lvl}.png")

    # Row 2 (Levels 7-12)
    for col in range(6):
        lvl = col + 7
        x_start = int(w1 * (col / 6.0))
        x_end = int(w1 * ((col + 1) / 6.0))
        y_start = int(grid_y_start + row_height)
        y_end = int(grid_y_start + 2 * row_height)
        
        pad_x = int((x_end - x_start) * 0.02)
        pad_y_top = int(row_height * 0.14)
        pad_y_bottom = int(row_height * 0.35)
        
        crop_box = (x_start + pad_x, y_start + pad_y_top, x_end - pad_x, y_end - pad_y_bottom)
        ship_crop = img1.crop(crop_box)
        ship_crop.save(f"{output_dir}/{lvl}.png", "PNG")
        print(f"  Saved Level {lvl}: {output_dir}/{lvl}.png")

    # Row 3 (Levels 13-17)
    # Row 3 contains 5 columns, centered or distributed
    # Let's handle 5 columns. There are 5 cards in Row 3.
    # From visual analysis, the 5 cards are distributed. Let's crop them using 5 columns.
    for col in range(5):
        lvl = col + 13
        x_start = int(w1 * (col / 5.0))
        x_end = int(w1 * ((col + 1) / 5.0))
        y_start = int(grid_y_start + 2 * row_height)
        y_end = int(grid_y_end)
        
        pad_x = int((x_end - x_start) * 0.02)
        pad_y_top = int(row_height * 0.14)
        pad_y_bottom = int(row_height * 0.35)
        
        crop_box = (x_start + pad_x, y_start + pad_y_top, x_end - pad_x, y_end - pad_y_bottom)
        ship_crop = img1.crop(crop_box)
        ship_crop.save(f"{output_dir}/{lvl}.png", "PNG")
        print(f"  Saved Level {lvl}: {output_dir}/{lvl}.png")


    # Process Sheet 2 (Levels 18 to 31)
    # Row 1: Levels 18, 19, 20, 21, 22, 23 (6 items)
    # Row 2: Levels 24, 25, 26, 27, 28, 29 (6 items)
    # Row 3: Levels 30, 31 (2 items)
    print("\nProcessing Sheet 2...")
    img2 = Image.open(sheet2)
    w2, h2 = img2.size

    grid2_y_start = int(h2 * 0.05)
    grid2_y_end = int(h2 * 0.67) # The bottom rows of sheet 2 are shorter or have larger spacing
    row_height2 = (grid2_y_end - grid2_y_start) / 2 # Row 1 and Row 2

    # Row 1 (Levels 18-23)
    for col in range(6):
        lvl = col + 18
        x_start = int(w2 * (col / 6.0))
        x_end = int(w2 * ((col + 1) / 6.0))
        y_start = int(grid2_y_start)
        y_end = int(grid2_y_start + row_height2)
        
        pad_x = int((x_end - x_start) * 0.02)
        pad_y_top = int(row_height2 * 0.14)
        pad_y_bottom = int(row_height2 * 0.35)
        
        crop_box = (x_start + pad_x, y_start + pad_y_top, x_end - pad_x, y_end - pad_y_bottom)
        ship_crop = img2.crop(crop_box)
        ship_crop.save(f"{output_dir}/{lvl}.png", "PNG")
        print(f"  Saved Level {lvl}: {output_dir}/{lvl}.png")

    # Row 2 (Levels 24-29)
    for col in range(6):
        lvl = col + 24
        x_start = int(w2 * (col / 6.0))
        x_end = int(w2 * ((col + 1) / 6.0))
        y_start = int(grid2_y_start + row_height2)
        y_end = int(grid2_y_end)
        
        pad_x = int((x_end - x_start) * 0.02)
        pad_y_top = int(row_height2 * 0.14)
        pad_y_bottom = int(row_height2 * 0.35)
        
        crop_box = (x_start + pad_x, y_start + pad_y_top, x_end - pad_x, y_end - pad_y_bottom)
        ship_crop = img2.crop(crop_box)
        ship_crop.save(f"{output_dir}/{lvl}.png", "PNG")
        print(f"  Saved Level {lvl}: {output_dir}/{lvl}.png")

    # Row 3 (Levels 30-31)
    # Level 30 is on the left half, Level 31 is on the right half.
    # Total grid size at bottom from visual analysis
    y_start_r3 = int(h2 * 0.67)
    y_end_r3 = int(h2 * 0.93)
    row_height3 = y_end_r3 - y_start_r3

    # Level 30
    x_start_30 = int(w2 * 0.02)
    x_end_30 = int(w2 * 0.48)
    pad_x_30 = int((x_end_30 - x_start_30) * 0.02)
    pad_y_top_30 = int(row_height3 * 0.10)
    pad_y_bottom_30 = int(row_height3 * 0.32)
    crop_box_30 = (x_start_30 + pad_x_30, y_start_r3 + pad_y_top_30, x_end_30 - pad_x_30, y_end_r3 - pad_y_bottom_30)
    ship_crop_30 = img2.crop(crop_box_30)
    ship_crop_30.save(f"{output_dir}/30.png", "PNG")
    print(f"  Saved Level 30: {output_dir}/30.png")

    # Level 31
    x_start_31 = int(w2 * 0.52)
    x_end_31 = int(w2 * 0.98)
    pad_x_31 = int((x_end_31 - x_start_31) * 0.02)
    pad_y_top_31 = int(row_height3 * 0.10)
    pad_y_bottom_31 = int(row_height3 * 0.32)
    crop_box_31 = (x_start_31 + pad_x_31, y_start_r3 + pad_y_top_31, x_end_31 - pad_x_31, y_end_r3 - pad_y_bottom_31)
    ship_crop_31 = img2.crop(crop_box_31)
    ship_crop_31.save(f"{output_dir}/31.png", "PNG")
    print(f"  Saved Level 31: {output_dir}/31.png")

    print("\n[+] Successfully cropped all 31 ships!")
    print("All individual ship images have been saved to './assets/ships/'")

if __name__ == "__main__":
    crop_sheets()
