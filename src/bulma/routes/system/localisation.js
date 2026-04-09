import routeImporter from '@enso-ui/ui/src/modules/importers/routeImporter';

const routes = routeImporter.fromGlob(import.meta.glob('./localisation/*.js', { eager: true }));
const Router = () => import('@enso-ui/ui/src/bulma/pages/Router.vue');

export default {
    path: 'localisation',
    component: Router,
    meta: {
        breadcrumb: 'localisation',
        route: 'system.localisation.index',
    },
    children: routes,
};
