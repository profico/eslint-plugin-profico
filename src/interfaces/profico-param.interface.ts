import { ProficoDecorator } from "./profico-decorator.interface";

export interface ProficoParam {
  name: string;
  decorators: ProficoDecorator[];
  range: number[];
}
