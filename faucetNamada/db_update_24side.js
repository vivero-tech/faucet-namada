import mysql from 'mysql2/promise';
import moment from 'moment';// Для удобной работы с датами
import dotenv from 'dotenv';
dotenv.config();


const connectionConfig = {
    host: "localhost",
    user: "newlogin",
    password: "newpar666",
    database: "faucet",
};
async function updateStatus() {
  let connection;

  try {
    connection = await mysql.createConnection(connectionConfig);

    // Получаем все записи из таблицы
    const [rows] = await connection.execute('SELECT * FROM faucetSide');

    // Текущее время
    const now = moment();

    // Перебираем все записи
    for (let row of rows) {
      const recordTime = moment(row.time);
      const duration = moment.duration(now.diff(recordTime));

      // Если прошло меньше 24 часов
      if (duration.asHours() < 24) {
        // Обновляем статус на 'blocked'
        await connection.execute('UPDATE faucetSide SET status = ? WHERE id = ?', ['blocked', row.id]);
      } else {
        // Обновляем статус на 'working'
        await connection.execute('UPDATE faucetSide SET status = ? WHERE id = ?', ['working', row.id]);
      }
    }

    console.log('Статусы успешно обновлены.');
  } catch (error) {
    console.error('Ошибка при обновлении статусов:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
  }
  
  updateStatus();