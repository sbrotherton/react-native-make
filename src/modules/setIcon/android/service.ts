import {
    checkImageIsSquare,
    generateAdaptiveAssets, generateAdaptiveAssetsRound, generateAdaptiveAssetsRounded,
    generateFeatureGraphic,
    generateResizedAssets
} from '../../../services/image.processing';
import {config} from './config';
import {ANDROID_MAIN_PATH, ANDROID_MAIN_RES_PATH} from '../../config';
import {join} from 'path';
import {copyFile, replaceInFile} from '../../../services/file.processing';
import {getHexColor} from '../../../services/color.processing';

export const addAndroidIcon = async (iconSource: string, backgroundColor: string) => {
    try {
        await checkImageIsSquare(iconSource);
        await generateLegacyIcons(iconSource);
        await generateAdaptiveIcons(iconSource, backgroundColor);
        await generatePlayStoreIcon(iconSource);
        await generatePlayStoreFeatureImage(iconSource, backgroundColor);
    } catch (err) {
        console.log(err);
    }
};

const generateLegacyIcons = (iconSource: string) =>
    Promise.all(
        config.androidIconSizes.map(size => {
            Promise.all([
                generateAdaptiveAssetsRounded(
                    iconSource,
                    `${ANDROID_MAIN_RES_PATH}/mipmap-${size.density}/ic_launcher.png`,
                    size.value,
                    size.iconSize
                ),
                generateAdaptiveAssetsRound(
                    iconSource,
                    `${ANDROID_MAIN_RES_PATH}/mipmap-${size.density}/ic_launcher_round.png`,
                    size.value,
                    Math.round(size.value * 0.915)
                )
            ])
        })
    );

const generateAdaptiveIcons = (iconSource: string, backgroundColor: string) => {
    replaceInFile(
        join(__dirname, `../../../../templates/android/values/colors-icon.xml`),
        `${ANDROID_MAIN_RES_PATH}/values/colors-icon.xml`,
        [
            {
                newContent: getHexColor(backgroundColor),
                oldContent: /{{iconBackground}}/g,
            },
        ]
    );

    replaceInFile(
        `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
        `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
        [
            {
                newContent: '',
                oldContent: /^.*android:roundIcon.*[\r\n]/gm,
            },
        ]
    );

    replaceInFile(
        `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
        `${ANDROID_MAIN_PATH}/AndroidManifest.xml`,
        [
            {
                newContent: '      android:icon="@mipmap/ic_launcher"',
                oldContent: /^.*android:icon.*$/gm,
            },
        ]
    );

    // Create the adaptive icon base templates as per Android Asset Studio
    const destinationDirectoryPath = `${ANDROID_MAIN_RES_PATH}/mipmap-anydpi-v26`;

    // Regular icon
    copyFile(
        join(__dirname, `../../../../templates/android/mipmap/ic_launcher.xml`),
        `${destinationDirectoryPath}/ic_launcher.xml`
    );

    // Rounded icon
    copyFile(
        join(__dirname, `../../../../templates/android/mipmap/ic_launcher_round.xml`),
        `${destinationDirectoryPath}/ic_launcher_round.xml`
    );

    return Promise.all(
        config.androidIconSizes.map(size => generateAdaptiveIcon(
            iconSource,
            size.density,
            size.adaptiveValue,
            size.adaptiveIconSize
        ))
    );
};

const generatePlayStoreIcon = (iconSource: string) =>
    generateResizedAssets(
        iconSource,
        `${ANDROID_MAIN_PATH}/ic_launcher-playstore.png`,
        512
    );

const generatePlayStoreFeatureImage = (iconSource: string, backgroundColor: string) =>
    generateFeatureGraphic(
        iconSource,
        `${ANDROID_MAIN_PATH}/featureGraphic.png`,
        backgroundColor
    );

const generateAdaptiveIcon = (iconSource: string, density: string, adaptiveValue: number, adaptiveIconSize: number) => {
    const destinationDirectoryPath = `${ANDROID_MAIN_RES_PATH}/mipmap-${density}`;
    return generateAdaptiveAssets(
        iconSource,
        `${destinationDirectoryPath}/ic_foreground.png`,
        adaptiveValue,
        adaptiveIconSize
    );
};
