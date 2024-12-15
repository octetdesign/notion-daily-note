/**
 * Notionがコードブロックでサポートしている言語
 *  ref.
 *    node_modules/@notionhq/client/build/src/api-endpoints.d.ts
 *    type LanguageRequest
 */
type LanguageRequest =
  | 'abap'
  | 'agda'
  | 'arduino'
  | 'assembly'
  | 'bash'
  | 'basic'
  | 'bnf'
  | 'c'
  | 'c#'
  | 'c++'
  | 'clojure'
  | 'coffeescript'
  | 'coq'
  | 'css'
  | 'dart'
  | 'dhall'
  | 'diff'
  | 'docker'
  | 'ebnf'
  | 'elixir'
  | 'elm'
  | 'erlang'
  | 'f#'
  | 'flow'
  | 'fortran'
  | 'gherkin'
  | 'glsl'
  | 'go'
  | 'graphql'
  | 'groovy'
  | 'haskell'
  | 'html'
  | 'idris'
  | 'java'
  | 'javascript'
  | 'json'
  | 'julia'
  | 'kotlin'
  | 'latex'
  | 'less'
  | 'lisp'
  | 'livescript'
  | 'llvm ir'
  | 'lua'
  | 'makefile'
  | 'markdown'
  | 'markup'
  | 'matlab'
  | 'mathematica'
  | 'mermaid'
  | 'nix'
  | 'notion formula'
  | 'objective-c'
  | 'ocaml'
  | 'pascal'
  | 'perl'
  | 'php'
  | 'plain text'
  | 'powershell'
  | 'prolog'
  | 'protobuf'
  | 'purescript'
  | 'python'
  | 'r'
  | 'racket'
  | 'reason'
  | 'ruby'
  | 'rust'
  | 'sass'
  | 'scala'
  | 'scheme'
  | 'scss'
  | 'shell'
  | 'solidity'
  | 'sql'
  | 'swift'
  | 'toml'
  | 'typescript'
  | 'vb.net'
  | 'verilog'
  | 'vhdl'
  | 'visual basic'
  | 'webassembly'
  | 'xml'
  | 'yaml'
  | 'java/c/c++/c#'

/**
 * Map: vscode languageId - Notion LanguageRequest
 *
 * Visual Studio Code language identifiers
 * https://code.visualstudio.com/docs/languages/identifiers
 */
const LangMap: { [lang: string]: LanguageRequest } = {
  abap: 'abap', // 	ABAP
  bat: 'shell', // 'bat', // 	Windows Bat
  // bibtex: 'bibtex', // 	BibTeX
  clojure: 'clojure', // 	Clojure
  coffeescript: 'coffeescript', // 	Coffeescript
  c: 'c', // 	C
  cpp: 'c++', // 	C++
  csharp: 'c#', // 	C#
  // dockercompose: 'dockercompose', // 	Compose
  css: 'css', // 	CSS
  // 'cuda-cpp': 'cuda-cpp', // 	CUDA C++
  // d: 'd', // 	D
  dart: 'dart', // 	Dart
  pascal: 'pascal', // 	Delphi
  diff: 'diff', // 	Diff
  dockerfile: 'docker', // 	Dockerfile
  erlang: 'erlang', // 	Erlang
  // fsharp: 'fsharp', // 	F#
  // 'git-commit and git-rebase': 'git-commit and git-rebase', // 	Git
  go: 'go', // 	Go
  groovy: 'groovy', // 	Groovy
  // handlebars: 'handlebars', // 	Handlebars
  // haml: 'haml', // 	Haml
  haskell: 'haskell', // 	Haskell
  html: 'html', // 	HTML
  // ini: 'ini', // 	Ini
  java: 'java', // 	Java
  javascript: 'javascript', // 	JavaScript
  javascriptreact: 'javascript', // 	JavaScript JSX
  json: 'json', // 	JSON
  jsonc: 'json', // 'jsonc', // 	JSON with Comments
  // julia: 'julia', // 	Julia
  latex: 'latex', // 	LaTeX
  less: 'less', // 	Less
  lua: 'lua', // 	Lua
  makefile: 'makefile', // 	Makefile
  markdown: 'markdown', // 	Markdown
  'objective-c': 'objective-c', // 	Objective-C
  'objective-cpp': 'objective-c', // 	Objective-C++
  ocaml: 'ocaml', // 	OCaml
  // pascal: 'pascal', // 	Pascal
  // 'perl and perl6': 'perl and perl6', // 	Perl
  php: 'php', // 	PHP
  plaintext: 'plain text', // 	Plain Text
  powershell: 'powershell', // 	PowerShell
  // 'jade, pug': 'jade, pug', // 	Pug
  python: 'python', // 	Python
  r: 'r', // 	R
  // razor: 'razor', // 	Razor (cshtml)
  ruby: 'ruby', // 	Ruby
  rust: 'rust', // 	Rust
  // 'scss (syntax using curly brackets), sass (indented syntax)':
  //   'scss (syntax using curly brackets), sass (indented syntax)', // 	SCSS
  sass: 'sass',
  scss: 'scss',
  // shaderlab: 'shaderlab', // 	ShaderLab
  shellscript: 'shell', // 	Shell Script (Bash)
  // slim: 'slim', // 	Slim
  sql: 'sql', // 	SQL
  // stylus: 'stylus', // 	Stylus
  // svelte: 'svelte', // 	Svelte
  swift: 'swift', // 	Swift
  typescript: 'typescript', // 	TypeScript
  typescriptreact: 'typescript', // 	TypeScript JSX
  // tex: 'tex', // 	TeX
  vb: 'visual basic', // 	Visual Basic
  // vue: 'vue', // 	Vue
  // 'vue-html': 'vue-html', // 	Vue HTML
  xml: 'xml', // 	XML
  // xsl: 'xsl', // 	XSL
  yaml: 'yaml', // 	YAML
}

/**
 * エディタの言語からNotionの言語を取得
 * @param languageId
 * @returns
 */
export const getLanguage = (languageId?: string): LanguageRequest => {
  const defaultLang: LanguageRequest = 'plain text'
  if (!languageId) {
    return defaultLang
  }
  const lang = LangMap[languageId]
  return lang ? lang : defaultLang
}
