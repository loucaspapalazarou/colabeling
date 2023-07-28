import json
import os

if __name__ == "__main__":
    config_file = "../config.json"

    with open(config_file, "r") as f:
        data = json.load(f)

    HOST = data["Y-WEBSOCKET"]["HOST"]
    PORT = str(data["Y-WEBSOCKET"]["PORT"])
    YPERSISTENCE = data["Y-WEBSOCKET"]["YPERSISTENCE"]

    os.environ["HOST"] = HOST
    os.environ["PORT"] = PORT
    os.environ["YPERSISTENCE"] = YPERSISTENCE

    import subprocess

    subprocess.run(["node", "./node_modules/y-websocket/bin/server.js"])
