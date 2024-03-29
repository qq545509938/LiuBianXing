export const DelRules = [
    //左斜角
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15, 16, 17],
    [18, 19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39, 40, 41, 42],
    [43, 44, 45, 46, 47, 48, 49],
    [50, 51, 52, 53, 54, 55],
    [56, 57, 58, 59, 60],

    //右斜角
    [26, 35, 43, 50, 56],
    [18, 27, 36, 44, 51, 57],
    [11, 19, 28, 37, 45, 52, 58],
    [5, 12, 20, 29, 38, 46, 53, 59],
    [0, 6, 13, 21, 30, 39, 47, 54, 60],
    [1, 7, 14, 22, 31, 40, 48, 55],
    [2, 8, 15, 23, 32, 41, 49],
    [3, 9, 16, 24, 33, 42],
    [4, 10, 17, 25, 34],

    //水平
    [0, 5, 11, 18, 26],
    [1, 6, 12, 19, 27, 35],
    [2, 7, 13, 20, 28, 36, 43],
    [3, 8, 14, 21, 29, 37, 44, 50],
    [4, 9, 15, 22, 30, 38, 45, 51, 56],
    [10, 16, 23, 31, 39, 46, 52, 57],
    [17, 24, 32, 40, 47, 53, 58],
    [25, 33, 41, 48, 54, 59],
    [34, 42, 49, 55, 60]
];

export const Tiles = [
    {
        type: 1,
        list: [[[0, 0]]]
    },
    {
        type: 2,
        list: [
            [[1, -1], [0, 0], [1, 0], [0, 1]],
            [[0, 0], [1, 0], [-1, 1], [0, 1]],
            [[0, 0], [1, 0], [0, 1], [1, 1]]
        ]
    },
    {
        type: 3,
        list: [
            [[0, -1], [0, 0], [0, 1], [0, 2]],
            [[0, 0], [1, -1], [-1, 1], [-2, 2]],
            [[-1, 0], [0, 0], [1, 0], [2, 0]]
        ]
    },
    {
        type: 4,
        list: [
            [[0, 0], [0, 1], [0, -1], [-1, 0]],
            [[0, 0], [0, -1], [1, -1], [-1, 1]],
            [[0, 0], [0, 1], [0, -1], [1, 0]],
            [[0, 0], [1, 0], [-1, 0], [1, -1]],
            [[0, 0], [1, 0], [-1, 0], [-1, 1]]
        ]
    },
    {
        type: 5,
        list: [
            [[0, 0], [0, 1], [0, -1], [1, -1]],
            [[0, 0], [1, -1], [-1, 1], [-1, 0]],
            [[0, 0], [1, -1], [-1, 1], [1, 0]],
            [[0, 0], [1, 0], [-1, 0], [0, -1]],
            [[0, 0], [1, 0], [-1, 0], [0, 1]]
        ]
    },
    {
        type: 6,
        list: [
            [[0, -1], [-1, 0], [-1, 1], [0, 1]],
            [[-1, 0], [0, -1], [1, -1], [1, 0]],
            [[0, -1], [1, -1], [1, 0], [0, 1]],
            [[-1, 1], [0, 1], [1, 0], [1, -1]],
            [[-1, 0], [-1, 1], [0, -1], [1, -1]],
            [[-1, 0], [-1, 1], [0, 1], [1, 0]]
        ]
    }
];
