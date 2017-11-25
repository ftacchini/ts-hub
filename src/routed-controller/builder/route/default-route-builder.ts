import { unmanaged, injectable } from 'inversify';
import { Middleware } from "../../middleware";
import { Route } from "../../route";
import { Server } from "../../../server"
import { ControllerActivator } from "../../activator/controller-activator";
import { MiddlewareReader } from "../../reader";
import { RouteBuilder } from "./route-builder";
import "reflect-metadata";

@injectable()
export abstract class DefaultRouteBuilder<Information, GenericRouter, RequestHandler> implements RouteBuilder<Information, GenericRouter, RequestHandler> {

    protected information: Information;
    protected target: any;
    protected propertyKey: string;

    public constructor(
        @unmanaged() protected middlewareReader: MiddlewareReader,
        @unmanaged() protected activator: ControllerActivator<GenericRouter, RequestHandler>) {

    }

    public abstract supportsRouter(router: GenericRouter): boolean;
    public buildRoute(router: GenericRouter): Route<Information, GenericRouter, RequestHandler> {
        var route = this.createRouteInstance();
        route.middleware = this.buildRouteMiddleware(router);
        route.information = this.information;

        return route;
    }

    protected abstract createRouteInstance(): Route<Information, GenericRouter, RequestHandler>;
    protected buildRouteMiddleware(router: GenericRouter): Middleware<any, RequestHandler>[] {

        var builders = this.middlewareReader.readRouteMiddleware<GenericRouter, RequestHandler>(router, this.target, this.propertyKey);
        var middleware = builders.map((builder) => builder.buildMiddleware(router));

        var activatorMiddleware = this.activator.buildControllerActivationMiddleware(this.target, this.propertyKey, router);

        middleware.push(activatorMiddleware);

        return middleware.sort(middleware => middleware.priority);
    }

    public withInformation(information: Information) : this {
        this.information = information;
        return this;
    }

    public withTarget(target: any) : this {
        this.target = target;
        return this;
    }

    public withPropertyKey(propertyKey: string) : this {
        this.propertyKey = propertyKey;
        return this;
    }
}