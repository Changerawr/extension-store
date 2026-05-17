import type { ExtensionToolbar } from '@changerawr/markdown';
import { GeodeToolkitModal } from './components/GeodeToolkitModal';

export const geodeToolbar: ExtensionToolbar = {
    buttons: [
        {
            id: 'geode-toolkit',
            icon: 'ExtensionIcon',
            tooltip: 'GeodeMD Toolkit',
            group: 'media',
            onClick: (textarea) => {
                // Modal will handle all GeodeMD features
            },
        },
    ],
    customUI: [
        {
            buttonId: 'geode-toolkit',
            type: 'modal',
            component: GeodeToolkitModal,
        },
    ],
};
