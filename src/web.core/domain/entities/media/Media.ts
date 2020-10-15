import * as validator from 'class-validator';
import { ALLOW_DOCUMENT_FORMATS, ALLOW_DOCUMENT_SIZE, ALLOW_IMAGE_FORMATS, ALLOW_IMAGE_SIZE, ALLOW_VIDEO_FORMATS, ALLOW_VIDEO_SIZE, STORAGE_URL } from '../../../../configs/Configuration';
import { Application } from '../application/Application';
import { BaseEntity } from '../base/BaseEntity';
import { IMedia } from '../../types/media/IMedia';
import { ImageInfoVO } from './ImageInfoVO';
import { ImageOptimizationVO } from './ImageOptimizationVO';
import { MediaType } from '../../enums/media/MediaType';
import { MessageError } from '../../common/exceptions/message/MessageError';
import { SystemError } from '../../common/exceptions/SystemError';

export class StorageUrl {
    constructor(public urlPath: string, public url: string) {}
}

export class Media extends BaseEntity<IMedia> implements IMedia {
    constructor(data?: IMedia) {
        super(data);
    }

    get id(): string {
        return this.data.id;
    }

    set id(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'id');

        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'id');

        this.data.id = val;
    }

    get appId(): string {
        return this.data.appId;
    }

    set appId(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'app id');

        if (!validator.isUUID(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'app id');

        this.data.appId = val;
    }

    get createdById(): string | undefined {
        return this.data.createdById;
    }

    set createdById(val: string | undefined) {
        if (val) {
            if (!validator.isUUID(val))
                throw new SystemError(MessageError.PARAM_INVALID, 'created by');
        }

        this.data.createdById = val;
    }

    get type(): MediaType {
        return this.data.type;
    }

    set type(val: MediaType) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'file type');

        if (!validator.isEnum(val, MediaType))
            throw new SystemError(MessageError.PARAM_INVALID, 'file type');

        this.data.type = val;
    }

    get name(): string {
        return this.data.name;
    }

    set name(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'name');

        val = val.trim();
        if (val.length > 200)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'name', 200);

        this.data.name = val;
    }

    get extension(): string {
        return this.data.extension;
    }

    set extension(val: string) {
        if (!val)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'extension');

        val = val.trim().toLocaleLowerCase();
        if (val.length > 4)
            throw new SystemError(MessageError.PARAM_LEN_LESS_OR_EQUAL, 'extension', 4);

        if (this.type === MediaType.DOCUMENT)
            this._validateDocumentFormat(val);
        else if (this.type === MediaType.IMAGE)
            this._validateImageFormat(val);
        else if (this.type === MediaType.VIDEO)
            this._validateVideoFormat(val);

        this.data.extension = val;
    }

    get size(): number {
        return this.data.size;
    }

    set size(val: number) {
        if (!validator.isPositive(val))
            throw new SystemError(MessageError.PARAM_INVALID, 'size');

        if (this.type === MediaType.DOCUMENT)
            this._validateDocumentSize(val);
        else if (this.type === MediaType.IMAGE)
            this._validateImageSize(val);
        else if (this.type === MediaType.VIDEO)
            this._validateVideoSize(val);

        this.data.size = val;
    }

    get storageOriginalUrlPath(): string {
        if (this.type === MediaType.DOCUMENT)
            return this.getDocumentStorageUrlPath();
        else if (this.type === MediaType.IMAGE)
            return this.getImageStorageUrlPath();
        else if (this.type === MediaType.VIDEO)
            return this.getVideoStorageUrlPath();
        return '';
    }

    get info(): ImageInfoVO | undefined {
        return this.data.info && new ImageInfoVO(this.data.info);
    }

    set info(val: ImageInfoVO | undefined) {
        this.data.info = val && val.toData();
    }

    get optimizations(): ImageOptimizationVO[] | undefined {
        return this.data.optimizations && this.data.optimizations.map(opt => new ImageOptimizationVO(opt));
    }

    /* Relationship */

    get app(): Application | undefined {
        return this.data.app && new Application(this.data.app);
    }

    /* Handler */

    addOptimization(opt: ImageOptimizationVO) {
        if (!this.data.optimizations)
            this.data.optimizations = [];
        this.data.optimizations.push(opt.toData());
    }

    /* Begin - Media url path */

    // Prodive the document url path for the platforms to use.
    getDocumentMediaUrlPath(): string {
        return `/documents/${this.appId}/${this.id}.${this.extension}`;
    }

    // Prodive the image url path for the platforms to use.
    getImageMediaUrlPath(width?: number, height?: number): string {
        if (width && height)
            return `/images/${this.appId}/${this.id}_${width}x${height}.${this.extension}`;
        return `/images/${this.appId}/${this.id}.${this.extension}`;
    }

    // Prodive the video url path for the platforms to use.
    getVideoMediaUrlPath(): string {
        return `/videos/${this.appId}/${this.id}.${this.extension}`;
    }

    /* End - Media url path */

    /* Begin - Reverse proxy */

    // Use for reverse proxy when the platforms request the document file.
    getDocumentStorageUrl(): string {
        return STORAGE_URL + `/${this.appId}/` + this.getDocumentStorageUrlPath();
    }

    // Use for reverse proxy when the platforms request the image file.
    getImageStorageUrl(width?: number, height?: number): string {
        return STORAGE_URL + `/${this.appId}/` + this.getImageStorageUrlPath(width, height);
    }

    // Use for reverse proxy when the platforms request the video file.
    getVideoStorageUrl(): string {
        return STORAGE_URL + `/${this.appId}/` + this.getVideoStorageUrlPath();
    }

    /* End - Reverse proxy */

    /* Begin - Storage service */

    // Use for uploading the document to storage service like a name of storage object.
    getDocumentStorageUrlPath(): string {
        return `documents/${this.id}.${this.extension}`;
    }

    // Use for uploading the image to storage service like a name of storage object.
    getImageStorageUrlPath(width?: number, height?: number): string {
        if (width && height)
            return `images/${this.id}_${width}x${height}.${this.extension}`;
        return `images/${this.id}.${this.extension}`;
    }

    // Use for uploading the video to storage service like a name of storage object.
    getVideoStorageUrlPath(): string {
        return `videos/${this.id}.${this.extension}`;
    }

    /* End - Storage service */

    private _validateDocumentFormat(ext: string) {
        const formats = ALLOW_DOCUMENT_FORMATS;
        if (!formats.includes(ext))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, 'file', formats.join(', '));
    }

    private _validateImageFormat(ext: string) {
        const formats = ALLOW_IMAGE_FORMATS;
        if (!formats.includes(ext))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, 'file', formats.join(', '));
    }

    private _validateVideoFormat(ext: string) {
        const formats = ALLOW_VIDEO_FORMATS;
        if (!formats.includes(ext))
            throw new SystemError(MessageError.PARAM_FORMAT_INVALID, 'file', formats.join(', '));
    }

    private _validateDocumentSize(size: number) {
        const maxSize = ALLOW_DOCUMENT_SIZE;
        if (size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, 'file', maxSize / 1024 / 1024, 'MB');
    }

    private _validateImageSize(size: number) {
        const maxSize = ALLOW_IMAGE_SIZE;
        if (size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, 'file', maxSize / 1024, 'KB');
    }

    private _validateVideoSize(size: number) {
        const maxSize = ALLOW_VIDEO_SIZE;
        if (size > maxSize)
            throw new SystemError(MessageError.PARAM_SIZE_MAX, 'file', maxSize / 1024 / 1024, 'MB');
    }
}
