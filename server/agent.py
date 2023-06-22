import torch
import random
import numpy as np
from collections import deque
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
        self.model = Linear_QNet(8, 1024, 5)
        self.model.load()
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)
        self.state_old = None
        self.final_move = [0,0,0,0,0]

        self.plot_scores = []
        self.plot_mean_scores = []
        self.total_score = 0
        self.record = 0

    def get_state(self, raw_state):
        state = []
        for key in raw_state:
            state.append(raw_state[key])

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
        final_move = [0,0,0,0,0]
        if not self.model.loaded and random.randint(0, 200) < self.epsilon:
            move = random.randint(0, len(final_move) - 1)
            final_move[move] = 1
        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            move = torch.argmax(prediction).item()
            final_move[move] = 1

        return final_move


    def train(self, game_state):
        # get states
        state_new = self.get_state(game_state.state)
        state_old = state_new if self.state_old is None else self.state_old

        # train short memory
        self.train_short_memory(state_old, self.final_move, game_state.reward, state_new, game_state.done)

        # remember
        self.remember(state_old, self.final_move, game_state.reward, state_new, game_state.done)
        self.state_old = state_new

        if game_state.done:
            # train long memory, plot result
            # game.reset() should be made automatically
            self.n_games += 1
            self.train_long_memory()

            if game_state.score > self.record:
                self.record = game_state.score
                self.model.save()

            print('Game', self.n_games, 'Score', game_state.score, 'Record:', self.record)

            self.plot_scores.append(game_state.score)
            self.total_score += game_state.score
            mean_score = self.total_score / self.n_games
            self.plot_mean_scores.append(mean_score)
            plot(self.plot_scores, self.plot_mean_scores)

        # perform move
        self.final_move = self.get_action(self.state_old)

        return self.final_move
