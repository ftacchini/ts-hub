import { ParameterBuilder } from "../builder/parameter-builder";

export interface ParameterReader {
    readParameters<GenericRouter>(target: any, propertyKey: string, router: GenericRouter): ParameterBuilder<any, GenericRouter>[];
    readParameterType(target: any, propertyKey: any, arg: number): any;
}