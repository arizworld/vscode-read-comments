import { Position, TextDocument } from "vscode";
import * as ts from 'typescript';
import { forEachComment } from 'tsutils';
import { ParsedComment } from "../types";
import { Parser } from "../utils/parser";
export default class TsParser extends Parser {

  parseComments(document: TextDocument): { start: Position; end: Position; comment: string }[] {
    const filePath = document.fileName;
    const source = ts.sys.readFile(filePath);
    if (source) {
      const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest);
      const parsedComments: ParsedComment[] = [];
      const sourceCode = sourceFile.getFullText();
      forEachComment(sourceFile, (_, cRange) => {
        parsedComments.push({
          content: this.util.extract(sourceCode.slice(cRange.pos, cRange.end + 1)),
          start: cRange.pos,
          end: cRange.end
        });
      }, sourceFile);
      return this.accumulateConsecutiveComments(parsedComments, document);
    }
    return [];
  }
}