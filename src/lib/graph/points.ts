export type Point = LeftPoint | RightPoint;
export type LeftPoint = {id: string; type: 'input' | 'param'};
export type RightPoint = {id: string; type: 'output' | 'return'};
