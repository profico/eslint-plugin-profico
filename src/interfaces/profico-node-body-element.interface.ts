import { ProficoDecorator } from "./profico-decorator.interface";
import { ProficoParam } from "./profico-param.interface";

export interface ProficoNodeBodyElement {
  decorators: ProficoDecorator[];
  type: "PropertyDefinition" | "MethodDefinition";
  value: {
    params: ProficoParam[];
  };
  range: number[];
}
