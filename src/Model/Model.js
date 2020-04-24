import QuizModel from './QuizModel';


export default class Model {
  constructor() {
    this._soundOn = true;
    this._musicOn = true;
    this._bgMusicPlaying = false;
    this._quiz = [new QuizModel('Qual o ano de criação do SERPRO?', '1964', ['2001', '1985', '1973','1964','1880'])
                  ,new QuizModel('A qual ministério o SERPRO é vinculado?', 'Ministério da Economia', ['Ministério da Economia', 'Ministério da Justiça', 'Ministério da Educação','Ministério da Informação'])
                  ,new QuizModel('Quantas regionais tem o SERPRO?', '11', ['5', '10', '11','15','24'])
                  ,new QuizModel('Qual o significado da sigla SERPRO?', 'Serviço Federal de Processamento de Dados', ['Serviço de Processamento de Dados Federal', 'Serviço Federal de Processamento de Dados', 'Serviço de Processamento de Dados','Secretaria Federal de Processamento de Dados'])
    ];
  }

  set musicOn(value) {
    this._musicOn = value;
  }

  get musicOn() {
    return this._musicOn;
  }

  set soundOn(value) {
    this._soundOn = value;
  }

  get soundOn() {
    return this._soundOn;
  }

  set bgMusicPlaying(value) {
    this._bgMusicPlaying = value;
  }

  get bgMusicPlaying() {
    return this._bgMusicPlaying;
  }

  set quiz(value) {
    this._quiz = value;
  }

  get quiz() {
    return this._quiz;
  }

}
