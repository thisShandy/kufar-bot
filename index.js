const {Builder, By, Key, util} = require("selenium-webdriver");
const webdriver = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome');
const chromedriver = require('chromedriver');

const TelegramBot = require("node-telegram-bot-api");
const token = TOKEN_CODE;
const bot = new TelegramBot(token, {polling: true});

chrome.setDefaultService(new chrome.ServiceBuilder(chromedriver.path).build());

const link = "https://www.kufar.by/l/pristavki?cbc=v.or%3A31&cur=BYR&prc=r%3A30000%2C100000&size=42&sort=lst.d";
const link_2 = "https://www.kufar.by/l";

const screen = {
  width: 640,
  height: 480
};

async function parser (link, id) {
  let driver = await new Builder().forBrowser("chrome").build();
  await driver.get(link);
  const good = await driver.findElement(By.css(".kf-swwP-96677 span")).getAttribute("innerHTML");
  console.log(  )

  const now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes();
  let minute_1 = now.getMinutes() - 1;
  let minute_2 = now.getMinutes() - 2;
  let minute_3 = now.getMinutes() - 3;
  minute = (minute < 10) ? '0' + minute : minute;
  minute_1 = (minute_1 < 10) ? '0' + minute_1 : minute_1;
  minute_2 = (minute_2 < 10) ? '0' + minute_2 : minute_2;
  minute_3 = (minute_3 < 10) ? '0' + minute_3 : minute_3;
  hour = (hour < 10) ? '0' + hour : hour;

  const time = "Сегодня, " + hour + ":" + minute;
  const time_1 = "Сегодня, " + hour + ":" + minute_1;
  const time_2 = "Сегодня, " + hour + ":" + minute_2;
  const time_3 = "Сегодня, " + hour + ":" + minute_3;

  if ( good === time || good === time_1 || good === time_2 || good === time_3 ) {
    const name = await driver.findElement(By.xpath("//div[@class='kf-swwP-96677']/ancestor::div[@class='kf-syas-f21f4']//h3[@class='kf-syGo-48c01']")).getAttribute("innerHTML");
    const img = await driver.findElement(By.xpath("//div[@class='kf-swwP-96677']/ancestor::a[@class='kf-syaE-c7444']//div[@class='kf-syaK-66027']/img")).getAttribute("src");
    const price = await driver.findElement(By.xpath("//div[@class='kf-swwP-96677']/../../div[@class='kf-svwC-74b3a']/span[@class='kf-svwq-48c1a']")).getAttribute("innerHTML");
    const link = await driver.findElement(By.xpath("//div[@class='kf-swwP-96677']/ancestor::a[@class='kf-syaE-c7444']")).getAttribute("href");
    let phone = "null";
    await driver.get(link);
    let description;
    try {
      description = await driver.findElement(By.css(".kf-BAwJ-afdce")).getAttribute("innerHTML");
      await driver.findElement(By.css(".kf-TBA-699e4")).click();
      await driver.findElement(By.css("#email")).sendKeys(EMAIL);
      await driver.findElement(By.css("#password")).sendKeys(PASSWORD, Key.ENTER)
      setTimeout(async() => {
        try {
          await driver.findElement(By.xpath("//*[@data-name='call_button']")).click();
          setTimeout(async () => {
            try {
              phone = await driver.findElement(By.css(".kf-WBaK-82bc8")).getAttribute("href");
              await bot.sendMessage(id, `${name} \n Цена: ${price} \n Описание: ${description}\n ${phone} \n Картинка: ${img} \n Ссылка: ${link}`);
              await driver.quit()
            }
            catch (e) {
              await bot.sendMessage(id, `${name} \n Цена: ${price} \n Описание: ${description}\n ${phone} \n Картинка: ${img} \n Ссылка: ${link}`);
              await driver.quit()
            }
          }, 1000)
        } catch (e) {
          await bot.sendMessage(id, `${name} \n Цена: ${price} \n Описание: ${description}\n ${phone} \n Картинка: ${img} \n Ссылка: ${link}`);
          await driver.quit()
        }
      }, 1000)
    } catch (e) {

    }

  } else {
    await driver.quit()
  }

};

bot.onText(/\/start/, msg => {
  const {chat: {id}} = msg;
  bot.sendMessage(id, "Привет - это Kufar-Bot для Даниеля. отправь мне ссылку поиска товаров с Kufar и я буду тебя оповещать о новых экземплярах: \n /setlink https://www.kufar.by/l/твой_товар");
});

bot.onText(/\/setlink (.+)/, async (msg, [sourse, match]) => {
  const {chat: {id}} = msg;
  setInterval(async () => {
    await parser(match, id);
  }, 120000)

});

