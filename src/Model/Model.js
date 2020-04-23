import QuizModel from './QuizModel';


export default class Model {
  constructor() {
    this._soundOn = true;
    this._musicOn = true;
    this._bgMusicPlaying = false;
    this._quiz = [new QuizModel('Marcelo', 'Bezerra', ['de', 'Alcantara', 'Bezerra']),
    new QuizModel('Liliane', 'Bezerra', ['de', 'Alcantara', 'Bezerra'])
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
