import pyautogui
import time

# Time interval in seconds
interval = 10  # Move mouse every 10 seconds
moveX = 30
moveY = 50

try:
    while True:
        # Get current mouse position
        x, y = pyautogui.position()

        # Print the position before the move
        print("Before moving:", x, y)

        # Move the mouse slightly
        pyautogui.moveTo(x + moveX, y + moveY, duration=0.1)

        # Get the new mouse position after moving
        new_x, new_y = pyautogui.position()
        print("Now cursor position:", new_x, new_y)

        # Wait for the specified interval
        time.sleep(interval)
except KeyboardInterrupt:
    print("Script stopped by user.", flush=True)
