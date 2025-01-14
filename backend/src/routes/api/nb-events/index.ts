import { FastifyInstance, FastifyRequest } from 'fastify';
import { getNotebookEvents } from './eventUtils';
import { secureRoute } from '../../../utils/route-security';

export default async (fastify: FastifyInstance): Promise<void> => {
  fastify.get(
    '/:namespace/:name',
    secureRoute(fastify)(
      async (
        request: FastifyRequest<{
          Params: {
            namespace: string;
            name: string;
          };
          Querystring: {
            // TODO: Support server side filtering
            from?: string;
          };
        }>,
      ) => {
        const { namespace, name } = request.params;
        return getNotebookEvents(fastify, namespace, name);
      },
    ),
  );
};
