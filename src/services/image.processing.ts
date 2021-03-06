import {normalize} from 'path';
import sharp, {ResizeOptions} from 'sharp';
import {createDirectoryIfNotExists} from './file.processing';

export const generateResizedAssets = async (
    sourcePath: string,
    destinationPath: string,
    width: number,
    height: number = width,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    createDirectoryIfNotExists(destinationPath);
    return sharp(normalize(sourcePath))
        .resize(width, height, options)
        .toFile(destinationPath);
};

export const generateAdaptiveAssets = async (
    sourcePath: string,
    destinationPath: string,
    width: number,
    iconSize: number,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    createDirectoryIfNotExists(destinationPath);
    return sharp({
        create: {
            width,
            height: width,
            channels: 4,
            background: "rgba(255, 255, 255, 0)"
        }
    }).composite([{
        input: await sharp(normalize(sourcePath))
            .resize(iconSize, iconSize, options)
            .toBuffer()
    }])
        .toFile(destinationPath);
};

export const generateAdaptiveAssetsRounded = async (
    sourcePath: string,
    destinationPath: string,
    width: number,
    iconSize: number,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    const rect = Buffer.from(
        `<svg><rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${iconSize / 12}" ry="${iconSize / 12}"/></svg>`
    );

    createDirectoryIfNotExists(destinationPath);
    return sharp({
        create: {
            width,
            height: width,
            channels: 4,
            background: "rgba(255, 255, 255, 0)"
        }
    }).composite([{
        input: await sharp(normalize(sourcePath))
            .resize(iconSize, iconSize, options)
            .composite([{input: rect, blend: 'dest-in'}])
            .toBuffer()
    }])
        .toFile(destinationPath);
};

export const generateAdaptiveAssetsRound = async (
    sourcePath: string,
    destinationPath: string,
    width: number,
    iconSize: number,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    const rect = Buffer.from(
        `<svg><rect x="0" y="0" width="${iconSize}" height="${iconSize}" rx="${iconSize / 2}" ry="${iconSize / 2}"/></svg>`
    );

    createDirectoryIfNotExists(destinationPath);
    return sharp({
        create: {
            width,
            height: width,
            channels: 4,
            background: "rgba(255, 255, 255, 0)"
        }
    }).composite([{
        input: await sharp(normalize(sourcePath))
            .resize(iconSize, iconSize, options)
            .composite([{input: rect, blend: 'dest-in'}])
            .toBuffer()
    }])
        .toFile(destinationPath);
};

export const generateFeatureGraphic = async (
    sourcePath: string,
    destinationPath: string,
    backgroundColor: string,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    createDirectoryIfNotExists(destinationPath);
    return sharp({
        create: {
            width: 1024,
            height: 500,
            channels: 4,
            background: backgroundColor
        }
    }).composite([{
        input: await sharp(normalize(sourcePath))
            .resize(500, 500, options)
            .toBuffer()
    }])
        .toFile(destinationPath);
};

export const generateResizedAssetsWithoutAlpha = async (
    sourcePath: string,
    destinationPath: string,
    width: number,
    height: number = width,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    createDirectoryIfNotExists(destinationPath);
    return sharp(normalize(sourcePath))
        .resize(width, height, options)
        .removeAlpha()
        .toFile(destinationPath);
};

export const checkImageIsSquare = async (sourcePath: string) => {
    const {width, height} = await sharp(normalize(sourcePath)).metadata();
    if (width !== height) {
        throw new Error('Image is not squared');
    }
};
