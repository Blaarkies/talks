import { Component } from '@angular/core';
import { PaneComponent } from '../../../../../common/component/pane/pane.component';
import {
  toHuffmanDictionary,
  toHuffmanTree,
} from '../../common/encode';
import { CustomInputEncoderDecoderComponent } from '../custom-input-encoder-decoder/custom-input-encoder-decoder.component';

let codeDelimiter = String.fromCharCode(8);
let dictionaryDelimiter = String.fromCharCode(127);

@Component({
  selector: 'app-custom-huffman-converter',
  standalone: true,
  imports: [
    CustomInputEncoderDecoderComponent,
    PaneComponent,
  ],
  templateUrl: './custom-huffman-converter.component.html',
  styleUrl: './custom-huffman-converter.component.scss',
})
export class CustomHuffmanConverterComponent {

  protected encodeStringToHuffmanFn = (text: string) => {
    let safeText = text
      .split('')
      .filter(c => c !== codeDelimiter && c !== dictionaryDelimiter)
      .join('');

    let dictionary = toHuffmanDictionary(toHuffmanTree(safeText));

    let encoded = safeText
      .split('')
      .map(c => dictionary.get(c).path)
      .join('');

    let stringDictionary = Array.from(dictionary)
      .map(([k, v]) =>
        // when 0/1 is the character to be encoded, we need to be able to
        // differentiate the end of this code and that of the next
        ((k === '0' || k === '1') ? codeDelimiter : '')
        + k + v.path)
      .join('');

    return stringDictionary + dictionaryDelimiter + encoded;
  };

  protected decodeHuffmanToStringFn = (text: string) => {
    let [definitions, encoded] = text.split(dictionaryDelimiter);

    let dictionary = definitions
      .split('')
      .reduce((state, c) => {
        let char = state.currentChar;
        if (char) {
          // end of code, but delimiter is not a 0/1
          if (c === codeDelimiter) {
            state.currentChar = null;
            return state;
          }

          // when anything other than binary was reached, we finished the
          // previous code
          let isEnd = !['0', '1'].includes(c);
          if (isEnd) {
            state.currentChar = c;
            return state;
          }

          // must be a bit value. add it to the current path
          let path = state.dictionary.get(char);
          state.dictionary.set(char, (path ?? '') + c);
          return state;
        } else {
          // at the start of the text. keep track of this char for
          // the next rounds
          state.currentChar = c;
        }

        return state;
      }, {dictionary: new Map<string, string>(), currentChar: null})
      .dictionary;
    let pathToCharMap = new Map(Array.from(dictionary, ([k,v]) => [v, k]));

    let decoded = encoded
      .split('')
      .reduce((state, c) => {
        state.path += c;

        let decoded = pathToCharMap.get(state.path);
        if (decoded) {
          state.output += decoded;
          state.path = '';
        }

        return state;
      }, {path: '', output: ''})
      .output;

    return decoded;
  };

  protected info = 'Encodings include the data\'s huffman dictionary in the ' +
    'following format for each symbol: [symbol][binary][?] <br/>The ' +
    'optional separator(, ascii 8) allows for encoding of 0/1 as symbols. ' +
    '<br/>The dictionary is separated from the encoded data by a [](ascii ' +
    '127) character.';

}
