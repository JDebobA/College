// Singleton - единые настройки игры
class GameConfig {
    static instance = null;

    constructor() {
        if (GameConfig.instance) return GameConfig.instance;
        
        this.maxHealth = 20;
        this.maxRounds = 10;
        this.baseArmor = 2;
        
        GameConfig.instance = this;
    }

    static getConfig() {
        if (!GameConfig.instance) {
            GameConfig.instance = new GameConfig();
        }
        return GameConfig.instance;
    }
}

// Builder - создаем персонажей с разными параметрами
class CharacterBuilder {
    constructor(name) {
        this.name = name;
        this.health = 15;
        this.armor = 2;
    }

    setHealth(value) {
        this.health = value;
        return this;
    }

    setArmor(value) {
        this.armor = value;
        return this;
    }

    build() {
        return new Character(
            this.name,
            this.health,
            this.armor
        );
    }
}

// Factory - создаем оружие
class WeaponFactory {
    static createWeapon(type) {
        switch(type) {
            case 'pepper':
                return { name: 'перцовка', damage: 5 };
            case 'knuckles':
                return { name: 'кастет', damage: 7 };
            default:
                return { name: 'перцовка', damage: 5 };
        }
    }
}

// Factory - создаем броню
class ArmorFactory {
    static createArmor(type) {
        switch(type) {
            case 'helmet':
                return { name: 'Шлем', defense: 5 };
            case 'plate':
                return { name: 'Доспех', defense: 10 };
            case 'greaves':
                return { name: 'Поножи', defense: 3 };
            default:
                return { name: 'Шлем', defense: 5 };
        }
    }
}

// Класс персонажа
class Character {
    constructor(name, health, armor) {
        this.name = name;
        this.health = health;
        this.armor = armor;
        this.weapon = null;
        this.armorPiece = null;
    }

    chooseWeapon() {
        const weapon1 = WeaponFactory.createWeapon('pepper');
        const weapon2 = WeaponFactory.createWeapon('knuckles');
        this.weapon = Math.random() > 0.5 ? weapon1 : weapon2;
        console.log(`${this.name} берет ${this.weapon.name}`);
    }

    chooseArmor() {
        const armor1 = ArmorFactory.createArmor('helmet');
        const armor2 = ArmorFactory.createArmor('plate');
        this.armorPiece = Math.random() > 0.5 ? armor1 : armor2;
        console.log(`${this.name} надевает ${this.armorPiece.name}`);
    }

    attack(target) {
        // Расчет урона
        const damage = this.weapon.damage;
        
        // Учет брони
        const totalDefense = target.armor + (target.armorPiece ? target.armorPiece.defense : 0);
        const actualDamage = Math.max(1, damage - totalDefense);
        target.health -= actualDamage;

        console.log(`${this.name} бьет ${this.weapon.name} -> ${damage} урона`);
        console.log(`${target.name} теряет ${actualDamage} здоровья`);
        console.log(`У ${target.name} осталось ${target.health} HP`);
    }

    isAlive() {
        return this.health > 0;
    }
}

// Создаем персонажей через Builder
const punk = new CharacterBuilder("Олег")
    .setHealth(18)
    .setArmor(2)
    .build();

const nefor = new CharacterBuilder("Саня")
    .setHealth(15)
    .setArmor(1)
    .build();

const normis = new CharacterBuilder("Орк Гриша")
    .setHealth(16)
    .setArmor(3)
    .build();

const pickme = new CharacterBuilder("Собака сутулая")
    .setHealth(14)
    .setArmor(2)
    .build();

// Все бойцы
const fighters = [punk, nefor, normis, pickme];

// Даем каждому оружие и броню
fighters.forEach(fighter => {
    fighter.chooseWeapon();
    fighter.chooseArmor();
});

// Функция боя в стиле "куча мала"
function meleeFight(fighters) {
    console.log("\n--- Куча мала ---");
    
    let round = 1;
    const config = GameConfig.getConfig();
    
    while (fighters.some(fighter => fighter.isAlive()) && round <= config.maxRounds) {
        console.log(`\nРаунд ${round}:`);
        
        fighters.forEach(fighter => {
            if (fighter.isAlive()) {
                // Случайный выбор цели для атаки
                let target = fighters[Math.floor(Math.random() * fighters.length)];
                while (target === fighter || !target.isAlive()) {
                    target = fighters[Math.floor(Math.random() * fighters.length)];
                }
                fighter.attack(target);
            }
        });
        
        round++;
    }

    // Определяем победителя
    const winner = fighters.find(fighter => fighter.isAlive());
    console.log(`\nПобедил: ${winner.name}`);
}

// Запускаем турнир в стиле "куча мала"
console.log("Начинается турнир!");
meleeFight(fighters);
console.log("Турнир окончен!");
