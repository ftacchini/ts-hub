/**
 * Created by Federico on 26/4/2017.
 */

import { Router as ExpressRouter } from "Express";
import {Middleware} from "./middleware";
import {RouteType} from "./route-type";

export class HttpRoute {

    public routeType: RouteType;
    public routeName: string;
    public middleware: RequestHandler[];

    public attachToRouter(router: ExpressRouter): void {
        router[this.routeType](this.routeName, this.middleware);
    }

}