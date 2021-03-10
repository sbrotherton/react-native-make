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
    height: number = width,
    options: ResizeOptions = {
        fit: 'contain',
    }
) => {
    createDirectoryIfNotExists(destinationPath);
    return sharp({
        create: {
            width,
            height,
            channels: 4,
            background: "rgba(255, 255, 255, 0)"
        }
    }).composite([{
        input: await sharp(normalize(sourcePath))
            .resize(Math.round(width * 0.66), Math.round(height * 0.66), options)
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
