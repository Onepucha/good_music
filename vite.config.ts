import vuePlugin from "@vitejs/plugin-vue";
import path from "path";
import {UserConfig} from "vite";
import {quasar, transformAssetUrls} from '@quasar/vite-plugin';

export default () => {
    const config: UserConfig = {
        plugins: [
            vuePlugin({
                template: {transformAssetUrls}
            }),
            quasar({
                sassVariables: 'src/assets/css/quasar-variables.scss'
            })
        ],
        server: {
            port: 3000
        },
        resolve: {
            alias: {
                "@": path.resolve(__dirname)
            }
        }
    };

    return config;
};
