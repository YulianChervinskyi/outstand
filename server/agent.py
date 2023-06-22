import torch
import random
import numpy as np
from collections import deque
# from game import SnakeGameAI, Direction, Point
from model import Linear_QNet, QTrainer
from helper import plot

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001

class Agent:

    def __init__(self):
        self.n_games = 0
        self.epsilon = 0 # randomness
        self.gamma = 0.9 # discount rate
        self.memory = deque(maxlen=MAX_MEMORY) # popleft()
        self.model = Linear_QNet(14, 256, 3)
        self.model.load()
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

        self.plot_scores = []
        self.plot_mean_scores = []
        self.total_score = 0
        self.record = 0

    def get_state(self, raw_state):
        state = [
        ]

        return np.array(state, dtype=int)

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done)) # popleft if MAX_MEMORY is reached

    def train_long_memory(self):
        if len(self.memory) > BATCH_SIZE:
            mini_sample = random.sample(self.memory, BATCH_SIZE) # list of tuples
        else:
            mini_sample = self.memory

        states, actions, rewards, next_states, dones = zip(*mini_sample)
        self.trainer.train_step(states, actions, rewards, next_states, dones)
        #for state, action, reward, nexrt_state, done in mini_sample:
        #    self.trainer.train_step(state, action, reward, next_state, done)

    def train_short_memory(self, state, action, reward, next_state, done):
        self.trainer.train_step(state, action, reward, next_state, done)

    def get_action(self, state):
        # random moves: tradeoff exploration / exploitation
        self.epsilon = 80 - self.n_games
        final_move = [0,0,0]
        if not self.model.loaded and random.randint(0, 200) < self.epsilon:
            move = random.randint(0, 2)
            final_move[move] = 1
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            move = torch.argmax(prediction).item()
            final_move[move] = 1

        return final_move


    def train(self, raw_state):
        # agent = Agent()
        # game = SnakeGameAI()
        while True:
            # get old state
            state_old = self.get_state(raw_state)

            # get move
            final_move = self.get_action(state_old)

            # perform move and get new state
            reward, done, score = game.play_step(final_move)
            state_new = self.get_state(game)

            # train short memory
            self.train_short_memory(state_old, final_move, reward, state_new, done)

            # remember
            self.remember(state_old, final_move, reward, state_new, done)

            if done:
                # train long memory, plot result
                game.reset()
                self.n_games += 1
                self.train_long_memory()

                if score > record:
                    record = score
                    self.model.save()

                print('Game', self.n_games, 'Score', score, 'Record:', record)

                self.plot_scores.append(score)
                self.total_score += score
                mean_score = self.total_score / self.n_games
                self.plot_mean_scores.append(mean_score)
                plot(self.plot_scores, self.plot_mean_scores)


# if __name__ == '__main__':
#     train()