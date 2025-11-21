// Генерируем простой уникальный идентификатор
function generateUUID() {
    return Math.random().toString(36).substr(2, 9); // Очень простая реализация
}

// Класс User
class User {
    constructor(name, login, password) {
        this.id = generateUUID();
        this.name = name;
        this.login = login;
        this.passwordHash = hashPassword(password, 'salt'); // Простое хэширование
        this.accounts = [];
        this.transactions = [];
    }
    
    checkPassword(inputPassword) {
        let hashedInput = hashPassword(inputPassword, 'salt');
        if(hashedInput === this.passwordHash){
            return true;
        }
        else{
            return false;
        }
    }
    
    createAccount(accountType) {
        const newAccount = new Account(generateUUID(), accountType, 0);
        this.accounts.push(newAccount);
        return newAccount;
    }
    
    findAccountById(accountId) {
        for(let i = 0; i < this.accounts.length; i++){
            if(this.accounts[i].id === accountId){
                return this.accounts[i];
            }
        }
        return null;
    }
}

// Класс Account
class Account {
    constructor(id, type, balance) {
        this.id = id;
        this.type = type;
        this.balance = balance;
    }
    
    deposit(amount) {
        this.balance += amount;
    }
    
    withdraw(amount) {
        if(this.balance >= amount){
            this.balance -= amount;
        }
        else{
            alert("Недостаточно средств");
        }
    }
    
    transferTo(targetAccount, amount) {
        if(this.balance >= amount){
            targetAccount.deposit(amount);
            this.withdraw(amount);
        }
        else{
            alert("Недостаточно средств");
        }
    }
}

// Класс Bank
class Bank {
    constructor(){
        this.users = [];
        this.currentUser = null;
    }
    
    registerUser(name, login, password) {
        const user = new User(name, login, password);
        this.users.push(user);
        return user;
    }
    
    login(login, password) {
        for(let i = 0; i < this.users.length; i++) {
            if(this.users[i].login === login && this.users[i].checkPassword(password)) {
                this.currentUser = this.users[i];
                break;
            }
        }
        
        if(!this.currentUser){
            alert("Логин или пароль неверны!");
        }
    }
    
    logout() {
        this.currentUser = null;
    }
    
    listUsers() {
        return this.users.map(u => u.name);
    }
    
    performTransfer(fromAccountId, toUserLogin, toAccountId, amount) {
        let senderAccount = this.currentUser.findAccountById(fromAccountId);
        let receiverUser = this.users.find(u => u.login === toUserLogin);
        let receiverAccount = receiverUser.findAccountById(toAccountId);
        
        if(senderAccount && receiverAccount){
            senderAccount.transferTo(receiverAccount, amount);
        }
        else{
            alert("Ошибка перевода.");
        }
    }
}

// Хэшируем пароль простым способом
function hashPassword(password, salt) {
    return btoa(password + salt).split('').reverse().join('');
}

// Основной цикл приложения
const myBank = new Bank();
let isLoggedIn = false;

while(true){
    if (!isLoggedIn) {
        let action = prompt("Выберите действие:\n1. Регистрация\n2. Вход\n3. Выход");
        switch(action) {
            case "1":
                let name = prompt("Ваше имя:");
                let login = prompt("Ваш логин:");
                let password = prompt("Ваш пароль:");
                myBank.registerUser(name, login, password);
                break;
                
            case "2":
                let inputLogin = prompt("Введите ваш логин:");
                let inputPassword = prompt("Введите ваш пароль:");
                myBank.login(inputLogin, inputPassword);
                isLoggedIn = true;
                break;
            
            case "3":
                alert("До свидания!");
                break;
        }
    } else { // Пользователь вошёл в систему
        let loggedAction = prompt("Выберите действие:\n1. Создать счёт\n2. Сделать перевод\n3. Посмотреть баланс\n4. Выйти из аккаунта");
        switch(loggedAction) {
            case "1":
                let accountType = prompt("Какой тип счёта создать?");
                myBank.currentUser.createAccount(accountType);
                break;
            
            case "2":
                let fromAccountId = prompt("От какого счёта перевести деньги?");
                let toUserLogin = prompt("Логин получателя:");
                let toAccountId = prompt("Номер счёта получателя:");
                let amount = parseFloat(prompt("Сумма перевода:"));
                myBank.performTransfer(fromAccountId, toUserLogin, toAccountId, amount);
                break;
            
            case "3":
                let balanceInfo = "";
                myBank.currentUser.accounts.forEach(acc => {
                    balanceInfo += `${acc.type}: ${acc.balance}\n`;
                });
                alert(`Баланс ваших счетов:\n${balanceInfo}`);
                break;
            
            case "4":
                myBank.logout();
                isLoggedIn = false;
                break;
        }
    }
}
