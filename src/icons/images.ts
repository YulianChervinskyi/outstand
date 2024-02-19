import {BoxType} from "../Box";
import note from "./notes.png";
import calc from "./calculator.png";
import tetris from "./tetris.png";
import fpe from "./fpe.png";
import fpb from "./fpb.png";
import asteroids from "./asteroids.png";
import minesweeper from "./minesweeper.png";
import bomberman from "./bomberman.png";
import darkTheme from "./dark_theme.png";
import lightTheme from "./light_theme.png";
import drive from "./drive.png";

export {darkTheme, lightTheme};

export const iconsPng = {
    [BoxType.Note]: note,
    [BoxType.Calc]: calc,
    [BoxType.Tetris]: tetris,
    [BoxType.Fpe]: fpe,
    [BoxType.Asteroids]: asteroids,
    [BoxType.Minesweeper]: minesweeper,
    [BoxType.Bomberman]: bomberman,
    [BoxType.Fpb]: fpb,
    [BoxType.Drive]: drive,
};