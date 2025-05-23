/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    User.register(data, ( error, response ) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response && response.error) {
        alert(response.error);
        return;
      }
      App.setState('user-logged');
      App.getModal('register').close();
    });
  }
}