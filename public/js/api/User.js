/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя из приложения
 * Имеет свойство URL, равное '/user'.
 * */
class User {
  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */

  static URL = '/user';

  static setCurrent(user) {
    window.localStorage.setItem("user", JSON.stringify(user));
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    if(!window.localStorage.getItem("user")) {
      return false;
    }
    window.localStorage.removeItem("user");
    return true;
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    let currentUser = {};
    try {
      currentUser = JSON.parse(window.localStorage.getItem("user"));
    } catch {
      currentUser = null;
    } finally {
      return currentUser;
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    // let data = this.current();
    createRequest({
      url: this.URL,
      method: "GET",
      responseType: "json",
      data: this.current(),
      callback: (err, response) => {
        // if(response.success) {
        // if(response.success === false) {
        //   User.unsetCurrent();
        // }
        // if(response.success === true) {
        //   User.setCurrent(response.user)
        // }
        if(err) {
          console.log(err);
        }
        if(response && response.error) {
          alert(err);
        }
        callback(err, response); 
        // }
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static login(data, callback) {
    createRequest({
      url: this.URL + '/login',
      method: 'POST',
      responseType: 'json',
      data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
  }

  /**
   * Производит попытку регистрации пользователя.
   * После успешной авторизации необходимо
   * сохранить пользователя через метод
   * User.setCurrent.
   * */
  static register(data, callback) {
    createRequest({
      url: this.URL + '/register',
      method: 'POST',
      responseType: 'json',
      data: data,
      callback: (err, response) => {
        if (response && response.user) {
          this.setCurrent(response.user);
        }
        callback(err, response);
      }
    });
    // comment
  }

  /**
   * Производит выход из приложения. После успешного
   * выхода необходимо вызвать метод User.unsetCurrent
   * */
  static logout(callback) {
    // let ExitAppComplete = true;
    // if(!alert("Вы уверены, что хотите выйти?")) {
    //   return;
    // }
    // User.unsetCurrent(); 
    // callback();

    createRequest({
      url: this.URL + '/logout',
      method: 'POST',
      responseType: 'json',
      data: this.current(),
      callback: (err, response) => {
        if (response && response.success) {
          this.unsetCurrent();
        }
        callback(err, response);
      }
    });
  }
}
