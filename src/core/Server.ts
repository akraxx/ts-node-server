import fastify from 'fastify';
import fastifyMetrics from 'fastify-metrics';
import helmet from 'fastify-helmet';
import {Logger} from 'pino';
import {Instance, Types} from '../Types';
import {Controller, swaggerPlugin, wireupPlugin} from '../plugins/api';
import {DEFAULT_LOGGER_OPTIONS, ServerOptions} from './ServerOptions';
import {MongoHealthcheck, MongoService} from '../mongo/api';
import {Healthcheck, HealthcheckController} from '../healthcheck/api';

export class Server {

    /**
     * Fastify instance
     */
    private _instance: Instance;

    /**
     * Get fastify instance
     * @returns {Instance}
     */
    public get instance(): Instance {
        return this._instance;
    }

    constructor(options: ServerOptions) {

        if (!options.logger) {
            options.logger = DEFAULT_LOGGER_OPTIONS;
        }

        this._instance = fastify(options);

        options.container.bind<Logger>(Types.Logger).toConstantValue(this._instance.log);

        this._instance.register(helmet);

        if (options.healthcheck) {
            options.container.bind<Controller>(Types.Controller).to(HealthcheckController).inSingletonScope();
        }

        this._instance.register(wireupPlugin, {container: options.container});

        if (options.swagger) {
            this._instance.register(swaggerPlugin, {container: options.container});
        }

        if (options.metrics) {
            const endpoint = typeof(options.metrics) === 'string' ? options.metrics : '/metrics';
            this._instance.register(fastifyMetrics, {endpoint});
        }

        if (options.mongo) {
            options.container.bind<MongoService>(Types.MongoService).to(MongoService).inSingletonScope();
            options.container.bind<Healthcheck>(Types.Healthcheck).to(MongoHealthcheck).inSingletonScope();
            (options.container.get(Types.MongoService) as MongoService).connect(options.mongo);
        }

        this._instance.ready(() => {
            this._instance.log.info('\n' + this._instance.printRoutes());
        });
    }

    /**
     * Listen
     * @param {number} port
     * @returns {string}
     */
    public async listen(port: number): Promise<string> {
        return this._instance.listen(port);
    }
}
