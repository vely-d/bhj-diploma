/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!document.body.contains(element)) {
      throw new Error("Can not create transactionss widget: there is no such element");
    }
    this.element = element;
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    document.querySelector(".create-income-button").addEventListener("click", function(event) {
      App.getModal("newIncome").open();
    })
    document.querySelector(".create-expense-button").addEventListener("click", function(event) {
      App.getModal("newExpense").open();
    })
  }
}
