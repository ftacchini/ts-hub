import { HttpActivatorMiddleware } from './http-activator-middleware';
import { inject, injectable } from 'inversify';
import { RequestHandler, Request, Response, NextFunction } from 'express';
import { ControllerActivator, Middleware, FunctionReader, ParamsReader, Types } from "../../../core";
import * as _ from "lodash";

@injectable()
export class HttpControllerActivator extends ControllerActivator<RequestHandler> { 

    constructor(
        @inject(Types.FunctionReader) functionReader: FunctionReader,
        @inject(Types.ParamsReader) paramsReader: ParamsReader) {
        super(functionReader, paramsReader);
    }

    protected turnIntoMiddleware(action: Function, params: {[index: number]: Function}) : Middleware<any, RequestHandler> {

        action.arguments

        var requestHandler: RequestHandler = (request: Request, response: Response, next: NextFunction): any => {

            var paramsArray: any[] = [];

            for(var index in params){
                paramsArray[index] = params[index](request, response);
            }

            return action(...paramsArray);
        };

        return new HttpActivatorMiddleware(requestHandler);
    };

}