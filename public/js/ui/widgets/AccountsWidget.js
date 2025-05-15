/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
  /**
   * Устанавливает текущий элемент в свойство element
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents()
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    if(!document.body.contains(element)) {
      throw new Error("Can not create accounts widget: there is no such element");
    }
    this.element = element;
    this.update();
    this.registerEvents();
    // this.update();
  }

  /**
   * При нажатии на .create-account открывает окно
   * #modal-new-account для создания нового счёта
   * При нажатии на один из существующих счетов
   * (которые отображены в боковой колонке),
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    document.querySelector(".create-account").addEventListener("click", function(event) {
      App.getModal("createAccount").open();
    });
    this.element.querySelectorAll(".account a").forEach(acc => {
      acc.addEventListener("click", (event) => {
        this.onSelectAccount(event.target);
      });
    })
  }

  /**
   * Метод доступен только авторизованным пользователям
   * (User.current()).
   * Если пользователь авторизован, необходимо
   * получить список счетов через Account.list(). При
   * успешном ответе необходимо очистить список ранее
   * отображённых счетов через AccountsWidget.clear().
   * Отображает список полученных счетов с помощью
   * метода renderItem()
   * */
  update() {
    if(User.current()) {
      Account.list(User.current(), ( error, response ) => {
        if(error) {
          console.log(error);
          return;
        }
        if(response && response.error) {
          alert(response.error);
          return;
        }
        this.clear();
        this.renderItem(response.data);
        this.registerEvents();
      });
    }
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого необходимо удалять все элементы .account
   * в боковой колонке
   * */
  clear() {
    document.querySelectorAll(".account").forEach(e => e.remove());
  }

  /**
   * Срабатывает в момент выбора счёта
   * Устанавливает текущему выбранному элементу счёта
   * класс .active. Удаляет ранее выбранному элементу
   * счёта класс .active.
   * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
   * */
  onSelectAccount( element ) {
    let activeAcc = document.querySelector(".account.active");
    activeAcc ? activeAcc.classList.remove("active") : 0;
    let newActiveAcc = element.closest(".account");
    newActiveAcc.classList.add("active");
    App.showPage('transactions', { account_id: newActiveAcc.dataset.id });
    // element
  }

  /**
   * Возвращает HTML-код счёта для последующего
   * отображения в боковой колонке.
   * item - объект с данными о счёте
   * */
  getAccountHTML(item){
    return `
      <li class="account" data-id="${item.id}">
          <a href="#">
              <span>${item.name}</span> /
              <span>${item.sum} ₽</span>
          </a>
      </li>
    `;
  }

  /**
   * Получает массив с информацией о счетах.
   * Отображает полученный с помощью метода
   * AccountsWidget.getAccountHTML HTML-код элемента
   * и добавляет его внутрь элемента виджета
   * */
  renderItem(data){
    for(let item of data) {
      this.element.insertAdjacentHTML("beforeend", this.getAccountHTML(item));
    }
  }
}
