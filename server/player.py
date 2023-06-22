import random


class Player:
    def __init__(self):
        self.direction = None
        self.change_direction = False

    def play(self, game_state):
        state = game_state["state"]
        variants = []
        for key in ["left", "right", "up", "down"]:
            if state[key] == 0 or state[key] == 5:
                variants.append(key)
    
        place = 0
        if state["center"] != 3 and state["bombs"] == 0:
            for key in ["left", "right", "up", "down"]:
                if state[key] == 1:
                    place = 1
                    break
    
        if self.change_direction:
            self.change_direction = False
            if self.direction == "up":
                self.direction = "down"
            elif self.direction == "down":
                self.direction = "up"
            elif self.direction == "left":
                self.direction = "right"
            elif self.direction == "right":
                self.direction = "left"
    
        elif not place:
            if self.direction is None or 0 < state[self.direction] < 5:
                self.direction = variants[random.randint(0, len(variants) - 1)]
            else:
                if self.direction == "up" and "down" in variants:
                    variants.remove("down")
                elif self.direction == "down" and "up" in variants:
                    variants.remove("up")
                elif self.direction == "left" and "right" in variants:
                    variants.remove("right")
                elif self.direction == "right" and "left" in variants:
                    variants.remove("left")
    
                for i in range(20):
                    variants.append(self.direction)
    
                self.direction = variants[random.randint(0, len(variants) - 1)]
    
        if place == 1:
            self.change_direction = True
    
        return {"left": 0, "right": 0, "up": 0, "down": 0, "place": place, self.direction: 1}
