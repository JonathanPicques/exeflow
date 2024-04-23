export type Point = LeftPoint | RightPoint;
export type LeftPoint = {id: string; type: 'input' | 'param'};
export type RightPoint = {id: string; type: 'output' | 'return'};

export const makeHandleId = ({id, type}: Point) => `${type}:${id}`;
export const splitHandleId = (handleId: string) => {
    const [type, ...id] = handleId.split(':');
    return {id: id.join(''), type} as Point;
};
