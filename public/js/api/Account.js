/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Получает информацию о счёте
   * */

  static URL = '/account';

  static get(id = '', callback){
    // super.list({ id: id }, callback);
    createRequest({
      url: this.URL + '/' + id,
      method: 'GET',
      responseType: 'json',
      data: {},
      callback: (err, response) => {
        callback(err, response);
      }
    });
  }
}
