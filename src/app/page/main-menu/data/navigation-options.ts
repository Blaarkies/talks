import { routeNames } from '@app/bootstrap/routes';
import { slideRouteNames } from '../../mode-presentation/route';

type Content = {
  text: string
  url?: string
}

export type VenueSelection = Required<Content>

export type NavigationOption = {
  label: string
  url: string
  title: string
  content: Content[]
  venues?: VenueSelection[]
}

const regexUrl = ['../', routeNames.present, slideRouteNames.regex].join('/');

export const navigationOptions: Record<string, NavigationOption> = {
  compression: {
    label: 'Data Compression',
    url: slideRouteNames.compression,
    title: 'Learn about data compression',
    content: [
      {text: 'What is fundamentally compressed'},
      {text: 'Small zipped files can be uncompressed without data loss'},
      {text: 'How to compress your friends'},
    ],
  },
  imageProcessing: {
    label: 'An image is worth 1000px',
    url: slideRouteNames.imageProcessing,
    title: 'Learn about image processing',
    content: [
      {text: 'How many pixels make a picture'},
      {text: 'Pixels are interpreted with the surrounding information'},
      {text: 'Your friends also have pixels'},
    ],
  },
  regex: {
    label: 'Regex Fundamentals',
    url: slideRouteNames.regex,
    title: 'Learn about Regex',
    content: [
      {text: 'How to find text'},
      {text: 'Matching advanced patterns'},
      {text: 'How to recognize your friends'},

    ],
    venues: [
      {text: 'Frontmania', url: [regexUrl, 'frontmania'].join('/')},
      {text: 'DevDay', url: [regexUrl, 'devday'].join('/')},
      {text: 'Engineer\'s Week', url: [regexUrl, 'engineers-week'].join('/')},
    ],
  },
};
