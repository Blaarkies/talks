import { slideRouteNames } from '../../mode-presentation/route';

export interface NavigationOption {
  label: string;
  url: string;
  title: string;
}

export const navigationOptions: Record<string, NavigationOption> = {
  compression: {
    label: 'What is Compression?',
    url: slideRouteNames.compression,
    title: 'Learn about data compression',
  },
  imageProcessing: {
    label: 'An image is worth 1000 pixels',
    url: slideRouteNames.imageProcessing,
    title: 'Learn about image processing',
  },
  regex: {
    label: 'Regex matching text patterns',
    url: slideRouteNames.regex,
    title: 'Learn about Regex',
  },
  asdf: {
    label: 'Using a Hard Disk',
    url: 'asdfasdfs',
    title: 'Learn about placeholders',
  },
};