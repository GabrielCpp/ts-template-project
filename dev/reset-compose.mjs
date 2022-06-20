#!./node_modules/zx/build/cli.js

import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { $, fs } from 'zx';

config()
const username = process.env['DB_USERNAME']
const password = process.env['DB_PASSWORD']
const db_name = process.env['DB_NAME']
const db_hostname = process.env['DB_HOST']

const composeDown = within(async () => {
   await $`docker-compose down --volume && docker-compose stop`
})

const dockerComposeContext = within(async () => {
   await composeDown
   await $`docker-compose up > /dev/null`
   
})

const psqlContext = within(async () => {
   await composeDown
   await $`./dev/wait-for-it.sh ${db_hostname}:5432`

   const AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: 5432,
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_NAME'],
      synchronize: false,
      logging: false,
      entities: [],
      subscribers: [],
      migrations: [],
    });

   let result = 0;

   do  {
      try {
          await AppDataSource.initialize();
          result = 0
      }
      catch {
         result = 1
      }
      
   } while(result != 0)

   config({
   path: '.env.test',
   override: true
   })
   const test_username = process.env['DB_USERNAME']
   const test_password = process.env['DB_PASSWORD']
   const test_db_name = process.env['DB_NAME']
   const createTestUserScript = `
   DO
   $do$
   BEGIN
      IF NOT EXISTS (
         SELECT FROM pg_catalog.pg_roles
         WHERE  rolname = '${test_username}') THEN

         CREATE USER ${test_username} WITH ENCRYPTED PASSWORD '${test_password}';
      END IF;   
   END
   $do$;

   CREATE DATABASE ${test_db_name};
   `

   const tempDir = os.tmpdir();
   const createTestUserScriptPath = path.join(tempDir, 'script.sql')
   await fs.writeFile(createTestUserScriptPath, createTestUserScript)

   await $`PGPASSWORD=${password} psql -p 5432 -h ${db_hostname} -U ${username} -d ${db_name} -f ${createTestUserScriptPath}`
   await $`docker-compose down`
})



