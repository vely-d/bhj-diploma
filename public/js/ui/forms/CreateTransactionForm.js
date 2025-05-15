/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element)
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    Account.list(User.current(), ( error, response ) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response && response.error) {
        // alert(response.error);
        console.log(response.error);
        return;
      }
      let select = this.element.querySelector(".accounts-select");
      select.innerHTML = "";
      for(let item of response.data) {
        select.innerHTML += `<option value="${item.id}">${item.name}</option>`;
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    // data.account_id = this.element.querySelector(`value=["${this.element['account_id'].value}"]`).value;
    data.account_id = this.element["account_id"].value;
    Transaction.create(data, (error, response) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response && response.error) {
        alert(response.error);
        return;
      }
      this.element.reset();
      let modalKey = { "new-income-form":"newIncome", "new-expense-form":"newExpense" }[this.element.id];
      App.getModal(modalKey).close();
      App.update();
    })
  }
}