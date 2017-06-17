import {HttpRouteInformation} from "./http-route-information";
import {HttpRoute} from "../http-route";
import {HttpRouteType} from "../http-route-type";

import {ControllerActivator} from "../../controller/controller-module"
import {RequestHandler} from "express";

import {DefaultMiddleware} from "../../middleware/middleware-module";
import {HttpMiddlewareBuilder} from "../middleware/http-middleware-builder";
import {HttpDefaultMiddlewareBuilder} from "../middleware/http-default-middleware-builder";
import {HttpDataParametersReader} from "../parameters/http-data-parameters-reader";
import * as MetadataKeys from "../http-metadata"
import * as _ from "lodash";

export class HttpRouteBuilder {

    constructor(protected target: any, protected property: string, protected information: HttpRouteInformation){
        
        this.information || (this.information = {
            route: this.target.constructor.name,
            type: "all"
        });

    }

    public buildRoute(controllerActivator: ControllerActivator) : HttpRoute{
        var route = new HttpRoute();
        route.middleware = _.union(
            this.buildRouteMiddleware(), 
            [this.buildControllerActivatorMiddleware(controllerActivator)]);
            
        route.routeName = this.information.route;
        route.routeType = this.information.type;
        return route;
    }

    private buildControllerActivatorMiddleware(controllerActivator: ControllerActivator): RequestHandler {
        var activatorFunction = controllerActivator.buildControllerActivationFunction(this.target, this.property);
        var middlewareBuilder = new HttpDefaultMiddlewareBuilder(this.target, this.property);
        return middlewareBuilder.setMiddleware(new DefaultMiddleware(activatorFunction))
                         .setParamsReader(new HttpDataParametersReader())
                         .setPriority(0)
                         .buildRequestHandler();
    }  

    private buildRouteMiddleware(): RequestHandler[] {
        return _.map(Reflect.getMetadata(MetadataKeys.HTTP_ROUTE_MIDDLEWARE, this.target), 
            target => {
                var middlewareBuilder =  <HttpMiddlewareBuilder>target;
                return middlewareBuilder.buildRequestHandler();
            });
    }
}