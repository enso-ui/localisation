import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter.fromGlob(import.meta.glob('./system/*.js', { eager: true }));

export default {
    path: '/system',
    children: routes,
};
