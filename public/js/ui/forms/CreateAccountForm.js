/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {

  constructor(element) {
    super(element);
  }
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, ( error, response ) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response.error) {
        alert(response.error);
        return;
      }
      App.update();
      this.element.reset();
      App.getModal("createAccount").close();
    });
  }
}