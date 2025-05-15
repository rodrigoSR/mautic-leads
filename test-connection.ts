import dataSource from './typeorm.config';

async function testConnection() {
    try {
        await dataSource.initialize();
        console.log('Conexão estabelecida com sucesso!');
        console.log('Tabelas existentes:', await dataSource.query('SELECT table_name FROM information_schema.tables WHERE table_schema = \'public\''));
        await dataSource.destroy();
    } catch (error) {
        console.error('Erro ao conectar:', error);
    }
}

testConnection();