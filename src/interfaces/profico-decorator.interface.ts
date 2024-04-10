export interface ProficoDecorator {
  expression: {
    callee: {
      name: string;
    };
  };
  type: "Decorator";
  range: number[];
  loc: {
    start: {
      column: number;
    };
  };
}
