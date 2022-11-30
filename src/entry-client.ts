import App from "@/src/App.vue";
import "@/src/assets/css/index.scss";
import createRouter from "@/src/router";
import { isPromise } from "@/src/utils";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { Quasar } from 'quasar';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

const router = createRouter();
const store = createPinia();

const app = createApp(App);

app.use(router).use(store);

router.beforeResolve(async (to, from, next) => {
    if (from && !from.name) {
        return next();
    }

    let diffed = false;
    const matched = router.resolve(to).matched;
    const prevMatched = router.resolve(from).matched;

    const activated = matched.filter((c, i) => {
        return diffed || (diffed = prevMatched[i] !== c);
    });

    if (!activated.length) {
        return next();
    }

    const matchedComponents: any = [];
    matched.forEach(route => {
        matchedComponents.push(...Object.values(route.components));
    });

    const asyncDataFuncs = matchedComponents.map((component: any) => {
        const asyncData = component.asyncData;

        if (!asyncData) {
            return;
        }

        const config = {
            store,
            route: to
        };

        if (!isPromise(asyncData)) {
            return Promise.resolve(asyncData(config));
        }

        return asyncData(config);
    });

    try {
        await Promise.all(asyncDataFuncs).then(() => {
            next();
        });
    } catch (err) {
        next(err as any);
    }
});

if (window.__INITIAL_STATE__) {
    store.state.value = window.__INITIAL_STATE__;
}

app.use(Quasar, {
    plugins: {}, // import Quasar plugins and add here
})

router.isReady().then(() => {
    app.mount("#app", true);
});
