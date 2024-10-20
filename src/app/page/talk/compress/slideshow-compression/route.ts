import { Route } from '@angular/router';

export const compressionSlideRouteNames = {
  teaser: 'compression-should-be-impossible',
  entropy: 'data-vs-information',
  runLengthEncoding: 'run-length-encoding',
  asciiInBinary: 'ascii-in-binary',
  huffmanCodingDictionary: 'huffman-coding-dictionary',
  huffmanCodingTree: 'huffman-coding-tree',
  aiAndCompression: 'ai-and-compression',
  lzw: 'lzw',
  otherAlgorithms: 'common-algorithms',
  end: 'end-and-questions',
  calculatingEntropy: 'calculating-entropy',
};

export const routes: Route[] = [
  {
    path: compressionSlideRouteNames.teaser,
    loadComponent: () => import( '../slide/slide-teaser/slide-teaser.component')
      .then(c => c.SlideTeaserComponent),
  },
  {
    path: compressionSlideRouteNames.entropy,
    loadComponent: () => import( '../slide/slide-explain-entropy/slide-explain-entropy.component')
      .then(c => c.SlideExplainEntropyComponent),
  },
  {
    path: compressionSlideRouteNames.runLengthEncoding,
    loadComponent: () => import( '../slide/slide-run-length-encoding/slide-run-length-encoding.component')
      .then(c => c.SlideRunLengthEncodingComponent),
  },
  {
    path: compressionSlideRouteNames.asciiInBinary,
    loadComponent: () => import( '../slide/slide-ascii-in-binary/slide-ascii-in-binary.component')
      .then(c => c.SlideAsciiInBinaryComponent),
  },
  {
    path: compressionSlideRouteNames.huffmanCodingDictionary,
    loadComponent: () => import( '../slide/slide-huffman-coding-dictionary/slide-huffman-coding-dictionary.component')
      .then(c => c.SlideHuffmanCodingDictionaryComponent),
  },
  {
    path: compressionSlideRouteNames.huffmanCodingTree,
    loadComponent: () => import( '../slide/slide-huffman-coding-tree/slide-huffman-coding-tree.component')
      .then(c => c.SlideHuffmanCodingTreeComponent),
  },
  {
    path: compressionSlideRouteNames.aiAndCompression,
    loadComponent: () => import( '../slide/slide-ai-and-compression/slide-ai-and-compression.component')
      .then(c => c.SlideAiAndCompressionComponent),
  },
  {
    path: compressionSlideRouteNames.lzw,
    loadComponent: () => import( '../slide/slide-lzw/slide-lzw.component')
      .then(c => c.SlideLzwComponent),
  },
  {
    path: compressionSlideRouteNames.otherAlgorithms,
    loadComponent: () => import( '../slide/slide-other-algorithms/slide-other-algorithms.component')
      .then(c => c.SlideOtherAlgorithmsComponent),
  },
  {
    path: compressionSlideRouteNames.end,
    loadComponent: () => import( '../slide/slide-end/slide-end.component')
      .then(c => c.SlideEndComponent),
    data: {qrData: 'blaarkies-talks.pages.dev/interactive/compression'},
  },
  {
    path: compressionSlideRouteNames.calculatingEntropy,
    loadComponent: () => import( '../slide/slide-calculating-entropy/slide-calculating-entropy.component')
      .then(c => c.SlideCalculatingEntropyComponent),
  },

  {
    path: '**',
    redirectTo: compressionSlideRouteNames.teaser,
  },

  // NeighborPreloader needs a list of sibling routes for each route.
  // This allows page route animations to play on first load
].map((r, i, self) => ({...r, data: {...r.data, siblings: self}}));