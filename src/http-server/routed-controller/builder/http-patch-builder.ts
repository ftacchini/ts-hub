import { MiddlewareReader, ControllerActivator, Middleware, Types } from "../../../core";
import { HttpRouteBuilder } from "./http-route-builder";
import { HttpRouteType } from "../../http-route-type";
import { Router as RequestHandler } from "express";
import { injectable, inject } from "inversify";
import "reflect-metadata";

@injectable()
export class HttpPatchBuilder extends HttpRouteBuilder {

    constructor(
        @inject(Types.MiddlewareReader) middlewareReader: MiddlewareReader, 
        controllerActivator: ControllerActivator<RequestHandler>) {
        super(middlewareReader, controllerActivator);
    }

    public getDefaultRouteType(): HttpRouteType {
        return "patch";
    }

    
}