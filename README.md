# HW12

Maze game from week09 ([code](https://github.com/DM-GY-6063-2023F-D/week09/tree/main/play-maze), [original game](https://dm-gy-6063-2023f-d.github.io/week09/play-maze/)), but updated to use an Arduino with 2 buttons and a potentiometer to control it.

The object that is created by the Arduino and sent to p5js looks like this:

```
data = {
  A0: {
    value: integer,
    delta:  [-1, 0, 1]
  },
  D2: {
    isPressed: boolean,
  },
  D3: {
    isPressed: boolean,
  }
}
```

```A0.delta``` is used to update the rotation of the maze: a positive delta means rotate left by 1°, a negative delta means rotate right by 1°, and a zero means no rotation.

```D2.isPressed``` can also be used to rotate left by 1° and ```D3.isPressed``` to rotate right by 1°.

## Schematic

## Board

## Picture

## Video
