/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!document.body.contains(element)) {
      throw new Error("Can not create transactions page: there is no such element");
    }
    this.element = element;
    this.registerEvents();
    this.lastOptions = null;
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    this.element.querySelector(".btn.remove-account").addEventListener("click", (event) => {
      this.removeAccount();
    });
    // this.element.querySelectorAll(".btn.transaction__remove").forEach(btn => {
    //   btn.addEventListener("click", event => {
    //     this.removeTransaction(event.target.dataset.id);
    //   });
    // });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if(!confirm("Вы действительно хотите удалить всю информацию о данном счёте? Вернуть её будет НЕВОЗМОЖНО")) {
      return;
    }
    let currentAcc = document.querySelector(".account.active");
    if(!currentAcc) {
      return;
    }
    Account.remove({ id: currentAcc.dataset.id }, (error, response) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response && response.error) {
        alert(response.error);
        return;
      }
      if(response && response.success) {
        this.clear();
        App.getWidget("accounts").update();
        App.getForm("createIncome").renderAccountsList();
        App.getForm("createExpense").renderAccountsList();
        alert("Счёт успешно удалён");
      }
    });
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(!confirm("Удалить эту транзакцию? Восттановить её будет невозможно")) {
      return;
    }
    Transaction.remove({ id: id }, (error, response) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response && response.error) {
        alert(response.error);
        return;
      }
      if(response && response.success) {
        // this.element.querySelector(`.transaction:has(.transaction__remove[data-id="${id}"])`).remove(); // fancy solution
        this.element.querySelector(`.transaction__remove[data-id="${id}"]`).closest(".transaction").remove(); 
        App.getWidget("accounts").update();
      }
    });
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(!options) {
      return;
    }
    Account.get(options.account_id, (error, response) => {
      if(error) {
        console.log(error);
        return;
      }
      if(response && response.error) {
        alert(error);
        return;
      }
      // response.data // {name: 'Бизнес', user_id: '1', id: '3', sum: 1439000}
      this.renderTitle(response.data.name);
      // this.renderTransactions();
      // response.data.account_id = response.data.id;
      // let accData = { account_id: response.id };
      Transaction.list({ account_id: response.data.id }, (error, response) => {
        if(error) {
          console.log(error);
          return;
        }
        if(response && response.error) {
          alert(error);
          return;
        }
        this.renderTransactions(response.data);
        this.lastOptions = options;
      });
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    // clear page somehow. idk
    this.renderTransactions([]);
    this.renderTitle("Название счёта");
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    return `${date.slice(8,10)} ${{ "01":"января", "02":"февраля", "03":"марта", "04":"апреля", "05":"мая", "06":"июня", "07":"июля", "08":"августа", "09":"сентября", "10":"октября", "11":"ноября", "12":"декабря" }[date.slice(5,7)]} ${date.slice(0,4)} г. в ${date.slice(11,13)}:${date.slice(14,16)}`;
  } 

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    return `
      <div class="transaction transaction_${item.type} row">
        <div class="col-md-7 transaction__details">
          <div class="transaction__icon">
              <span class="fa fa-money fa-2x"></span>
          </div>
          <div class="transaction__info">
              <h4 class="transaction__title">${item.name}</h4>
              <div class="transaction__date">${this.formatDate(item.created_at)}</div>
          </div>
        </div>
        <div class="col-md-3">
          <div class="transaction__summ">
              ${item.sum} <span class="currency">₽</span>
          </div>
        </div>
        <div class="col-md-2 transaction__controls">
            <button class="btn btn-danger transaction__remove" data-id="${item.id}" onclick="App.getPage('transactions').removeTransaction(this.dataset.id);">
                <i class="fa fa-trash"></i>  
            </button>
        </div>
    </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    let content = document.querySelector(".content");
    content.innerHTML = "";
    for(let item of data) {
      content.insertAdjacentHTML("beforeend", this.getTransactionHTML(item));
      // someElement.insertAdjacentHTML("beforeend", this.getTransactionHTML(item));
    }
  }
}