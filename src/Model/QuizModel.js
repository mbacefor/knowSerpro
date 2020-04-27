/**
 * Classe que representa uma pergunta a ser feita no quiz.
 */
export default class QuizModel {
  constructor(pergunta,resposta,opcoes) {
    this._pergunta = pergunta;
    this._resposta = resposta;
    this._opcoes = opcoes;
  }

  set pergunta(value) {
    this._pergunta = value;
  }

  get pergunta() {
    return this._pergunta;
  }

  set resposta(value) {
    this._resposta = value;
  }

  get resposta() {
    return this._resposta;
  }

  set opcoes(value) {
    this._opcoes = value;
  }

  get opcoes() {
    return this._opcoes;
  }
}