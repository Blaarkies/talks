import { Route } from '@angular/router';

export const compressionSlideRouteNames = {
  teaser: 'compression-should-be-impossible',
  entropy: 'data-vs-information',
  runLengthEncoding: 'run-length-encoding',
  asciiInBinary: 'ascii-in-binary',
  huffmanCodingDictionary: 'huffman-coding-dictionary',
  huffmanCodingTree: 'huffman-coding-tree',
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
    path: '**',
    redirectTo: compressionSlideRouteNames.teaser,
  },
].map((r, i, self) => ({...r, data: {siblings: self}}));