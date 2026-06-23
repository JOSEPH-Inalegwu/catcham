declare module "pngjs" {
  import { Duplex } from "stream";

  interface PNGOptions {
    width?: number;
    height?: number;
    fill?: boolean;
    checkCRC?: boolean;
    deflateChunkSize?: number;
    deflateLevel?: number;
    deflateStrategy?: number;
    deflateFactory?: unknown;
    filterType?: number | number[];
    colorType?: number;
    inputHasAlpha?: boolean;
    bgColor?: { red: number; green: number; blue: number };
  }

  interface PNGMetadata {
    width: number;
    height: number;
    depth: number;
    interlace: boolean;
    palette: boolean;
    color: boolean;
    alpha: boolean;
    bpp: number;
    colorType: number;
  }

  interface PNGAdapter {
    width: number;
    height: number;
    data: Buffer;
    gamma?: number;
    parse(buffer: Buffer | string, callback?: (err: Error | null, data: PNGAdapter) => void): void;
    pack(): PNGAdapter;
  }

  export class PNG extends Duplex implements PNGAdapter {
    static sync: {
      read(buffer: Buffer, options?: PNGOptions): PNGAdapter;
      write(adapter: PNGAdapter, options?: PNGOptions): Buffer;
    };

    static adjustGamma(src: PNGAdapter): void;
    static bitblt(
      src: PNGAdapter,
      dst: PNGAdapter,
      srcX: number,
      srcY: number,
      w: number,
      h: number,
      dstX: number,
      dstY: number
    ): void;

    width: number;
    height: number;
    data: Buffer;
    gamma?: number;

    constructor(options?: PNGOptions);
    parse(buffer: Buffer | string, callback?: (err: Error | null, data: PNGAdapter) => void): void;
    pack(): PNGAdapter;
  }
}
