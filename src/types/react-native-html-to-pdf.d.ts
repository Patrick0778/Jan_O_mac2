declare module 'react-native-html-to-pdf' {
  interface Options {
    html: string;
    fileName: string;
    directory?: string;
    base64?: boolean;
    height?: number;
    width?: number;
    padding?: number;
    bgColor?: string;
  }

  interface Result {
    filePath?: string;
    base64?: string;
  }

  export default {
    convert(options: Options): Promise<Result>;
  };
}
